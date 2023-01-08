import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { validate as isUUID } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { CategoriaImage } from './entities/categoria-image.entity';
import { validPathImage } from 'src/common/interfaces/valid-file';
import { FilesService } from 'src/files/files.service';
import { ProductosService } from 'src/productos/productos.service';

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger('CategoriasService');

  private defaultLimit: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(CategoriaImage)
    private readonly categoriaImageRepository: Repository<CategoriaImage>,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
    @Inject(forwardRef(() => ProductosService))
    private readonly productoService: ProductosService,

  ) {

    this.defaultLimit = this.configService.get<number>('defaultlimit');
  }

  async create(createCategoriaDto: CreateCategoriaDto) {
    const { images = [], ...categoriesDetails } = createCategoriaDto;
    if (!images.every(x => x.substring(0, 4).trim() === 'http' || x.substring(0, 5).trim() === 'https')) throw new BadRequestException('Image - Url not valid');
    const categoria = this.categoriaRepository.create({
      ...categoriesDetails, images: images.map(image => this.categoriaImageRepository.create({ url: image }))
    });
    await this.categoriaRepository.save(categoria);

    return { ...categoria, images }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0, orderby = 'id', sordir = 'asc', estado = 'all' } = paginationDto;
    const condition: FindOptionsWhere<Categoria> = (estado === 'all' ? {} : JSON.parse(`{"estado": "${(estado === 'active' ? true : false)}" }`))
    const orderBy: FindOptionsOrder<Categoria> = JSON.parse(`{"${orderby}": "${sordir}" }`)

    const categoria = await this.categoriaRepository.find({
      take: limit,
      skip: offset,
      order: orderBy,
      relations: {
        images: true,
        producto: true
      },
      where: condition
    })

    return categoria.map(({ images, producto, ...detailsCateg }) => ({
      ...detailsCateg,
      producto: producto.map(x => ({ id: x.id, nombre: x.nombre })),
      images:
        (images ? images.map(x => {
          if (!x.external) return `${this.configService.get<String>('HOST_API')}/${validPathImage.categories}/` + x.url
          return x.url;
        }) : [])
    }))
  }

  async findCategoriaImage(search: string) {
    const { images, ...detailsCat } = await this.findOne(search);
    return {
      ...detailsCat, images: (images ? images.map(x => {
        if (!x.external) return `${this.configService.get<String>('HOST_API')}/${validPathImage.categories}/` + x.url
        return x.url;
      }) : [])
    }
  }


  async findOne(search: string) {
    let categ: Categoria;
    if (isUUID(search)) {
      categ = await this.categoriaRepository.findOne({
        where: {
          id: search
        },
        relations: {
          images: true
        }
      });
    } else {
      categ = await this.categoriaRepository.findOne({
        where: {
          nombre: search.toLowerCase()
        },
        relations: {
          images: true
        }
      });
    }
    if (!categ) throw new NotFoundException(`Categoria with id or nombre ${search} not found`);
    return categ;
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    let { images = [], ...categoriesDetails } = updateCategoriaDto;
    if (!images.every(x => x.substring(0, 4).trim() === 'http' || x.substring(0, 5).trim() === 'https')) throw new BadRequestException('Image - Url not valid');
    const catActual = await this.findOne(id);
    if (updateCategoriaDto.id) updateCategoriaDto.id = id;
    const cat = await this.categoriaRepository.preload({ id, ...categoriesDetails })
    if (images.length) {
      await this.categoriaImageRepository.delete({ categoria: { id } });
      if (catActual.images.length !== 0) {
        const internalImages: string[] = catActual.images.filter(img => !img.external).map(img => img.url)
        this.filesService.deleteAllImage(internalImages, validPathImage.categories);
      }
      cat.images = images.map((image) => this.categoriaImageRepository.create({ url: image, external: true }))
    }

    await this.categoriaRepository.save(cat)
    return await this.findCategoriaImage(id)

  }

  async remove(id: string) {

    await this.findOne(id);
    const pro = await this.productoService.findProductoActive(id)
    if (pro) throw new InternalServerErrorException(`Category with id ${id} cannot be deleted because it is in use.`)
    await this.categoriaRepository.update({ id }, { estado: false });
    return { message: `Categoria with id ${id} deleted successfully` };

  }


  public async addImage(images: string, idCat: string) {
    try {
      const imagesCat = this.categoriaImageRepository.create({ url: images, categoria: { id: idCat } })
      await this.categoriaImageRepository.save(imagesCat);
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }

}
