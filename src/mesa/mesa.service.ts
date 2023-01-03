import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { Mesa } from './entities/mesa.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MesaService {
  private readonly logger = new Logger('MesasService');
  private defaultLimit: number;

  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultlimit');

  }


  async create(createMesaDto: CreateMesaDto) {
    const table = this.mesaRepository.create(createMesaDto);
    return await this.mesaRepository.save(table);


  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0, orderby = 'id', sordir = 'asc', estado = 'all' } = paginationDto;
    const condition: FindOptionsWhere<Mesa> = (estado === 'all' ? {} : { estado: (estado === 'active' ? true : false) })
    const orderBy: FindOptionsOrder<Mesa> = JSON.parse(`{"${orderby}": "${sordir}" }`)

    return await this.mesaRepository.find({
      take: limit,
      skip: offset,
      order: orderBy,
      where: condition
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
    if (updateMesaDto.id) updateMesaDto.id = id;
    await this.mesaRepository.update({ id }, {
      ...updateMesaDto
    })
    return { ...mesa, ...updateMesaDto };

  }

  async remove(id: string) {
    await this.findOne(id);
    await this.mesaRepository.update({ id }, { estado: false });
    return { message: `Mesa with id ${id} deleted successfully` };

  }

}
