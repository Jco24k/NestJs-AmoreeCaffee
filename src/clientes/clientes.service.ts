import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { validate as isUUID } from 'uuid';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger('ClienteService');
  private defaultLimit: number;

  constructor(

    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    private readonly configService: ConfigService,

  ) {

    this.defaultLimit = this.configService.get<number>('defaultlimit');
  }

  async create(createClienteDto: CreateClienteDto) {
    const { password, ...clienteData } = createClienteDto

    try {
      const cliente = this.clienteRepository.create({
        ...clienteData,
        password: bcrypt.hashSync(password, 10)
      });
      return await this.clienteRepository.save(cliente);
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0, orderby = 'id', sordir = 'asc', estado = 'all' } = paginationDto;
    const condition: FindOptionsWhere<Cliente> = (estado === 'all' ? {} : { estado: (estado === 'active' ? true : false) })
    const orderBy: FindOptionsOrder<Cliente> = JSON.parse(`{"${orderby}": "${sordir}" }`)

    return await this.clienteRepository.find({
      take: limit,
      skip: offset,
      order: orderBy,
      where: condition
    })
  }

  async findOne(search: string) {
    let cli: Cliente;
    if (isUUID(search)) {
      cli = await this.clienteRepository.findOneBy({ id: search });
    } else {
      cli = await this.clienteRepository.findOne({
        where: {
          correo: search.toLowerCase().trim()
        }
      });
    }
    if (!cli) throw new NotFoundException(`cliente with id or correo ${search} not found`);
    return cli;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    if (updateClienteDto.id) updateClienteDto.id = id;
    const cli = await this.findOne(id);
    try {
      if (updateClienteDto.password) updateClienteDto.password = bcrypt.hashSync(updateClienteDto.password, 10)
      await this.clienteRepository.update({ id }, {
        ...updateClienteDto
      })
      return { ...cli, ...updateClienteDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.clienteRepository.update({ id }, { estado: false });
    return { message: `Cliente with id ${id} deleted successfully` };

  }

  private handleException(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
