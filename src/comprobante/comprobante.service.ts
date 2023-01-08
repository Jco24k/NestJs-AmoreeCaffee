import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CabeceraPedidoService } from 'src/cabecera-pedido/cabecera-pedido.service';
import { CabeceraPedido } from 'src/cabecera-pedido/entities/cabecera-pedido.entity';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';
import { Comprobante } from './entities/comprobante.entity';
import { validate as isUUID } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ComprobanteService {
  private defaultLimit: number;

  constructor(
    @InjectRepository(Comprobante)
    private readonly comprobanteRepository: Repository<Comprobante>,
    @Inject(forwardRef(() => CabeceraPedidoService))
    private readonly cabeceraPedidoService: CabeceraPedidoService,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.get<number>('defaultlimit');

  }


  async create(createComprobanteDto: CreateComprobanteDto) {
    const { estado, ...detailsCab } = await this.cabeceraPedidoService.findOne(createComprobanteDto.cabeceraPedido.id);
    const Comprobante = this.comprobanteRepository.create(createComprobanteDto);
    return { ...(await this.comprobanteRepository.save(Comprobante)), cabeceraPedido: detailsCab };
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0, orderby = 'id', sordir = 'asc', estado = 'all' } = paginationDto;
    const condition: FindOptionsWhere<Comprobante> = (estado === 'all' ? {} : JSON.parse(`{"estado": "${(estado === 'active' ? true : false)}" }`))
    const orderBy: FindOptionsOrder<Comprobante> = JSON.parse(`{"${orderby}": "${sordir}" }`)

    return await this.comprobanteRepository.find({
      take: limit,
      skip: offset,
      order: orderBy,
      relations: {
        cabeceraPedido: true
      },
      where: condition
    });
  }

  async findOne(search: string) {
    let comprobante: Comprobante;
    if (isUUID(search)) {
      comprobante = await this.comprobanteRepository.findOneBy({ id: search });
    } else {
      comprobante = await this.comprobanteRepository.findOne({
        where: { nro: search.toLowerCase() }
      });
    }
    if (!comprobante) throw new NotFoundException(`Comprobante with id or nro ${search} not found`);
    const { cabeceraPedido: { estado, ...detailsPed } } = comprobante;
    return { ...comprobante, cabeceraPedido: detailsPed };
  }

  async update(id: string, updateComprobanteDto: UpdateComprobanteDto) {
    if (updateComprobanteDto.id) updateComprobanteDto.id = id;
    let { cabeceraPedido } = updateComprobanteDto;
    const comprobante = await this.findOne(id);
    if (cabeceraPedido) {
      updateComprobanteDto.cabeceraPedido = await this.cabeceraPedidoService.findOne(cabeceraPedido.id);
    }
    await this.comprobanteRepository.update({ id }, {
      ...updateComprobanteDto
    })
    return { ...comprobante, ...updateComprobanteDto };

  }

  async remove(id: string) {
    await this.findOne(id);
    const cabPedido = await this.cabeceraPedidoService.findCabeceraPedidoActive(id);
    if (cabPedido) throw new InternalServerErrorException(`Comprobante with id ${id} cannot be deleted because it is in use.`)
    await this.comprobanteRepository.update({ id }, { estado: false });
    return { message: `Comprobante with id ${id} deleted successfully` };

  }

}
