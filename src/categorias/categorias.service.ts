import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Producto } from 'src/productos/entities/producto.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Categoria } from './entities/categoria.entity';
import { validate as isUUID } from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CategoriasService {
  private readonly logger = new Logger('CategoriasService');


  constructor(

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly configService: ConfigService,

  ) { }

  async create(createCategoriaDto: CreateCategoriaDto) {
    try {
      const categoria = this.categoriaRepository.create(createCategoriaDto);
      return await this.categoriaRepository.save(categoria);

    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0, orderby = 'id', sordir = 'asc' } = paginationDto;
    const categoria = await this.categoriaRepository.find({
      take: limit,
      skip: offset,
      order: JSON.parse(`{"${orderby}": "${sordir}" }`),
      relations: {
        producto: true,
      }
    })

    return categoria.map(({ imagenUrl, ...detailsCateg }) => ({
      ...detailsCateg,
      imagenUrl: (imagenUrl ? `${this.configService.get<String>('HOST_API')}/categorias/` + imagenUrl : null)
    }))
  }

  async findOne(search: string) {
    let categ: Categoria;
    if (isUUID(search)) {
      categ = await this.categoriaRepository.findOne({
        where: {
          id: search
        },
        relations: {
          producto: true
        }
      });
    } else {
      categ = await this.categoriaRepository.findOne({
        where: {
          nombre: search.toLowerCase()
        },
        relations:{
          producto: true
        }
      });
    }
    if (!categ) throw new NotFoundException(`Categoria with id or nombre ${search} not found`);
    return {
      ...categ, imagenUrl: (
        categ.imagenUrl ? `${this.configService.get<String>('HOST_API')}/categorias/` + categ.imagenUrl : null)
    };
  }

  async update(id: string, updateCategoriaDto: UpdateCategoriaDto) {
    const categoria = await this.findOne(id);
    if (updateCategoriaDto.id) updateCategoriaDto.id = id;
    try {
      await this.categoriaRepository.update({ id }, {
        ...updateCategoriaDto
      })
      return { ...categoria, ...updateCategoriaDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const Categoria = await this.findOne(id);
    await this.categoriaRepository.update({ id }, { estado: false });
    return { message: `Categoria with id ${id} deleted successfully` };

  }

  private handleException(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
