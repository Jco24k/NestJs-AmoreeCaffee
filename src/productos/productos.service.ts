import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriasService } from 'src/categorias/categorias.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { validate as isUUID } from 'uuid';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { ConfigService } from '@nestjs/config';
import { ProductoImage } from '../producto-image/entities/producto-image.entity';

@Injectable()
export class ProductosService {
  private readonly logger = new Logger('ProductoService');


  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(ProductoImage)
    private readonly productoImageRepository: Repository<ProductoImage>,
    private readonly categoriaService: CategoriasService,
    private readonly configService: ConfigService,

  ) { }


  async create(createProductoDto: CreateProductoDto) {
    const { images = [], ...detailsPro } = createProductoDto;
    try {
      const producto = this.productoRepository.create({
        ...detailsPro,
        images: images.map(image =>
          this.productoImageRepository.create({ url: image }))
      });
      return { ...producto, images };

    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, orderby = 'id', sordir = 'asc' } = paginationDto;
    const listPro = await this.productoRepository.find({
      take: limit,
      skip: offset,
      order: JSON.parse(`{"${orderby}": "${sordir}" }`)
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
      relations:{ categoria:true, images: true}
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
    if (updateProductoDto.id) updateProductoDto.id = id;
    const { images, ...categoriesDetails } = updateProductoDto;

    let { categoria } = updateProductoDto;
    const producto = await this.findOne(id);
    if (categoria) {
      const { id, nombre } = await this.categoriaService.findOne(categoria.id);
      updateProductoDto.categoria = { id, nombre } as Categoria;
    }
    try {
      if( images ) {
        await this.productoImageRepository.delete({producto:{ id } });
      }
      await this.productoRepository.update({ id }, {
        ...updateProductoDto, images:
        images.map( image => this.productoImageRepository.create({ url: image }) )
      })
      return { ...producto, ...updateProductoDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productoRepository.update({ id }, { estado: false });
    return { message: `Producto with id ${id} deleted successfully` };

  }
  private handleException(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
