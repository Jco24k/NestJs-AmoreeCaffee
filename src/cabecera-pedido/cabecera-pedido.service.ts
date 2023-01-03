import { BadRequestException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientesService } from 'src/clientes/clientes.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MesaService } from 'src/mesa/mesa.service';
import { FindManyOptions, FindOneOptions, FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CreateCabeceraPedidoDto } from './dto/create-cabecera-pedido.dto';
import { UpdateCabeceraPedidoDto } from './dto/update-cabecera-pedido.dto';
import { CabeceraPedido } from './entities/cabecera-pedido.entity';
import { validate as isUUID } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { DetallePedidoService } from 'src/detalle-pedido/detalle-pedido.service';

@Injectable()
export class CabeceraPedidoService {
  private readonly logger = new Logger('CabeceraPedidoService');
  private defaultLimit: number;
  constructor(
    @InjectRepository(CabeceraPedido)
    private readonly cabeceraPedidoRepository: Repository<CabeceraPedido>,
    @Inject(forwardRef(() => ClientesService))
    private readonly clienteService: ClientesService,
    @Inject(forwardRef(() => MesaService))
    private readonly mesaService: MesaService,
    @Inject(forwardRef(() => DetallePedidoService))
    private readonly detallePedidoService: DetallePedidoService,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultlimit');

  }


  async create(createCabeceraPedidoDto: CreateCabeceraPedidoDto) {
    const { cliente, mesa } = createCabeceraPedidoDto;
    createCabeceraPedidoDto.cliente = await this.clienteService.findOne(cliente.id);
    if (!createCabeceraPedidoDto.cliente.estado) throw new BadRequestException(`Cliente with 'id' ${cliente.id} inactive`);
    if (mesa) {
      createCabeceraPedidoDto.mesa = await this.mesaService.findOne(mesa.id);
      if (!createCabeceraPedidoDto.mesa.estado) throw new BadRequestException(`Mesa with 'id' ${createCabeceraPedidoDto.mesa.id} inactive`);
    }

    try {
      const cab = this.cabeceraPedidoRepository.create(createCabeceraPedidoDto);
      return await this.cabeceraPedidoRepository.save(cab);

    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0, orderby = 'id', sordir = 'asc', estado = 'all' } = paginationDto;
    const condition: FindOptionsWhere<CabeceraPedido> = (estado === 'all' ? {} : JSON.parse(`{"estado": "${(estado === 'active' ? true : false)}" }`))
    const orderBy: FindOptionsOrder<CabeceraPedido> = JSON.parse(`{"${orderby}": "${sordir}" }`)

    return await this.cabeceraPedidoRepository.find({
      take: limit,
      skip: offset,
      order: orderBy,
      relations: {
        cliente: true, mesa: true
      },
      where: condition
    })
  }

  async findOne(id: string) {
    let cab: CabeceraPedido = await this.cabeceraPedidoRepository.findOneBy({ id });

    if (!cab) throw new NotFoundException(`CabeceraPedido with id '${id}' not found`);
    return cab;
  }

  async update(id: string, updateCabeceraPedidoDto: UpdateCabeceraPedidoDto) {
    const { cliente, mesa } = updateCabeceraPedidoDto;
    if (updateCabeceraPedidoDto.id) updateCabeceraPedidoDto.id = id;
    const cab = await this.findOne(id);
    if (cliente) {
      let cl = await this.clienteService.findOne(!cliente.id ? '' : cliente.id);
      if (!cl.estado) throw new BadRequestException(`Cliente with 'id' ${cliente.id} inactive`);
    }

    if (mesa) {
      const table = await this.mesaService.findOne(!mesa.id ? '' : mesa.id);
      if (!table.estado) throw new BadRequestException(`Mesa with 'id' ${mesa.id} inactive`);
    }
    try {
      await this.cabeceraPedidoRepository.update({ id }, {
        ...updateCabeceraPedidoDto
      })
      return { ...cab, ...updateCabeceraPedidoDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    const detPedido = await this.detallePedidoService.findDetallePedidoActive(id);
    if (detPedido) throw new InternalServerErrorException(`CabeceraPedido with id ${id} cannot be deleted because it is in use.`)
    await this.cabeceraPedidoRepository.update({ id }, { estado: false });
    return { message: `CabeceraPedido with id ${id} deleted successfully` };

  }

  private handleException(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }


  async findCabeceraPedidoActive(id: string) {
    return await this.cabeceraPedidoRepository.findOne({
      where: {
        id,
        estado: true
      }
    });
  }
}
