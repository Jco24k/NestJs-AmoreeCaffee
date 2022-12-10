import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { Mesa } from './entities/mesa.entity';

@Injectable()
export class MesaService {
  private readonly logger = new Logger('MesasService');

  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>
  ) {}
  

  async create(createMesaDto: CreateMesaDto) {
    try {
      const Mesa = this.mesaRepository.create(createMesaDto);
      return await this.mesaRepository.save(Mesa);

    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll( paginationDto: PaginationDto ) {
    const { limit = 10, offset = 0 , orderby = 'id' , sordir = 'asc' } = paginationDto;
    return await this.mesaRepository.find({
      take: limit,
      skip: offset,
      order: JSON.parse( `{"${orderby}": "${sordir}" }`)
    })
  }

  async findOne(search: string) {
    let mesa: Mesa;
    if (isUUID(search)) {
      mesa = await this.mesaRepository.findOneBy({ id: search });
    } else {
      mesa = await this.mesaRepository.findOne({
        where: {
          nombre: search.toLowerCase()
        }
      });
    }
    if (!mesa) throw new NotFoundException(`Mesa with id or nombre ${search} not found`);
    return mesa;
  }

  async update(id: string, updateMesaDto: UpdateMesaDto) {
    const mesa = await this.findOne(id);
    if(updateMesaDto.id) updateMesaDto.id = id;
    try {
      await this.mesaRepository.update({id},{
        ...updateMesaDto
      })
      return { ...mesa, ...updateMesaDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const mesa = await this.findOne(id);
    await this.mesaRepository.update({id},{estado:false});
    return { message: `Mesa with id ${id} deleted successfully` };

  }

  private handleException(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
  
}
