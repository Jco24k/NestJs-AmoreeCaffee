import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriasService } from 'src/categorias/categorias.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { validate as isUUID } from 'uuid';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { ConfigService } from '@nestjs/config';
import { ProductoImage } from './entities/producto-image.entity';
import { validPathImage } from 'src/common/interfaces/valid-file';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger('ProductoService');
  private defaultLimit: number;


  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(ProductoImage)
    private readonly productoImageRepository: Repository<ProductoImage>,
    @Inject(forwardRef(() => CategoriasService))
    private readonly categoriaService: CategoriasService,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService


  ) {
    this.defaultLimit = this.configService.get<number>('defaultlimit');

  }


  async create(createProductoDto: CreateProductoDto) {
    const { images = [], categoria, ...detailsPro } = createProductoDto;
    if (!images.every(x => x.substring(0, 4).trim() === 'http' || x.substring(0, 5).trim() === 'https')) throw new BadRequestException('Image - Url not valid');
    if (!categoria.id || !isUUID(categoria.id)) throw new BadRequestException('Categoria "id" uuid is expected');
    const cat = await this.categoriaService.findOne(categoria.id);
    if (!cat.estado) throw new BadRequestException(`Categoria with id '${categoria.id}' is inactive`)
    const pro = this.productoRepository.create({
      categoria, ...detailsPro,
      images: images.map(image => this.productoImageRepository.create({ url: image }))
    });
    await this.productoRepository.save(pro);
 
    return { ...pro, images };


  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = this.defaultLimit, offset = 0, orderby = 'id', sordir = 'asc', estado = 'all' } = paginationDto;
    const condition: FindOptionsWhere<Producto> = (estado === 'all' ? {} : JSON.parse(`{"estado": "${(estado === 'active' ? true : false)}" }`))
    const orderBy: FindOptionsOrder<Producto> = JSON.parse(`{"${orderby}": "${sordir}" }`)

    const listPro = await this.productoRepository.find({
      take: limit,
      skip: offset,
      order: orderBy,
      where: condition

    })

    return listPro.map(({ categoria: { nombre, id }, images, ...detailsPro }) => ({
      ...detailsPro,
      categoria: { nombre, id },
      images:
        (images ? images.map(x => {
          if (!x.external) return `${this.configService.get<String>('HOST_API')}/productos/` + x.url
          return x.url;
        }) : [])
    }))
  }
  async findProductImage(search: string) {
    const { images, ...detailsPro } = await this.findOne(search);
    return {
      ...detailsPro, images: (images ? images.map(x => {
        if (!x.external) return `${this.configService.get<String>('HOST_API')}/${validPathImage.products}/` + x.url
        return x.url;
      }) : [])
    }
  }


  async findOne(search: string) {
    let producto: Producto;
    if (isUUID(search)) {
      producto = await this.productoRepository.findOne({ where: { id: search }, relations: { images: true } });
    } else {
      producto = await this.productoRepository.findOne({
        where: {
          nombre: search.toLowerCase()
        },
        relations: { images: true }
      });
    }
    if (!producto) throw new NotFoundException(`producto with id or nombre ${search} not found`);
    const { categoria: { nombre, id } } = producto;
    return producto;
  }

  async findOnebyCategoria(search: string, categoria: string) {
    const pro = await this.productoRepository.findOne({
      where: {
        nombre: search,
        categoria: {
          nombre: categoria
        }
      }
    });

    if (!pro) throw new NotFoundException(`producto or categoria not found`);
    return pro;
  }

  async findAllbyCategoria(categoria: string) {
    const pro = await this.productoRepository.find({
      where: {
        categoria: {
          nombre: categoria
        }
      },
      relations: { categoria: true, images: true }
    });
    return pro.map(({ categoria: { nombre, id }, images, ...detailsPro }) => ({
      ...detailsPro,
      categoria: { nombre, id },
      images:
        (images ? images.map(x => {
          if (!x.external) return `${this.configService.get<String>('HOST_API')}/productos/` + x.url
          return x.url;
        }) : [])
    }))
  }


  async update(id: string, updateProductoDto: UpdateProductoDto) {
    let { images = [], categoria, ...categoriesDetails } = updateProductoDto;
    if (!images.every(x => x.substring(0, 4).trim() === 'http' || x.substring(0, 5).trim() === 'https')) throw new BadRequestException('Image - Url not valid');
    const proActual = await this.findOne(id);
    if (updateProductoDto.id) updateProductoDto.id = id;
    if (categoria) {
      if (!categoria.id || !isUUID(categoria.id)) throw new BadRequestException('Categoria "id" uuid is expected');
      const { id, nombre } = await this.categoriaService.findOne(categoria.id);
      categoria = { id, nombre } as Categoria;
    }
    const pro = await this.productoRepository.preload({ id, ...categoriesDetails })
    if (images.length) {
      await this.productoImageRepository.delete({ producto: { id } });
      if (proActual.images.length !== 0) {
        const internalImages: string[] = proActual.images.filter(img => !img.external).map(img => img.url)
        this.filesService.deleteAllImage(internalImages, validPathImage.products);
      }
      pro.images = images.map((image) => this.productoImageRepository.create({ url: image, external: true }))
    }
    await this.productoRepository.save(pro)

    return { ...categoriesDetails, images, categoria };

  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productoRepository.update({ id }, { estado: false });
    return { message: `Producto with id ${id} deleted successfully` };

  }

  public async addImage(images: string, idPro: string) {
    try {
      const imagesCat = this.productoImageRepository.create({ url: images, producto: { id: idPro } })
      await this.productoImageRepository.save(imagesCat);
      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  }


  async findProductoActive(id: string) {
    return await this.productoRepository.findOne({
      where: {
        categoria: {
          id
        },
        estado: true

      }
    });
  }

}
