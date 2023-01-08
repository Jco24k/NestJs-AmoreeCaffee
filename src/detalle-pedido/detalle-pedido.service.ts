import { BadRequestException, Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CabeceraPedidoService } from 'src/cabecera-pedido/cabecera-pedido.service';
import { UpdateCabeceraPedidoDto } from 'src/cabecera-pedido/dto/update-cabecera-pedido.dto';
import { Producto } from 'src/productos/entities/producto.entity';
import { ProductosService } from 'src/productos/productos.service';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { ConfigService } from '@nestjs/config';
import { FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class DetallePedidoService {

  private readonly logger = new Logger('DetallePedidoService');
  private defaultLimit: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(DetallePedido)
    private readonly detallePedidoRepository: Repository<DetallePedido>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @Inject(forwardRef(() => CabeceraPedidoService))
    private readonly cabeceraPedidoService: CabeceraPedidoService,
    @Inject(forwardRef(() => ProductosService))
    private readonly productoService: ProductosService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultlimit');

  }


  async create(createDetallePedidoDto: CreateDetallePedidoDto) {
    const { producto, cabeceraPedido } = createDetallePedidoDto;
    const cabPedido = await this.cabeceraPedidoService.findOne(cabeceraPedido.id);
    if (!cabPedido.estado) throw new BadRequestException(`DetallePedido with producto id ${cabeceraPedido.id} is inactive`)
    const pro = await this.productoService.findOne(producto.id);
    if (!pro.estado) throw new BadRequestException(`DetallePedido with producto id ${producto.id} is inactive`)


    const det = this.detallePedidoRepository.create(createDetallePedidoDto);
    const detalleInsert = await this.detallePedidoRepository.save(det);
    const listDetalles = await this.detallePedidoRepository.find({
      where: {
        cabeceraPedidoId: detalleInsert.cabeceraPedidoId
      }
    })
    let total: number = 0;
    listDetalles.forEach((detalle) => { total += +detalle.subtotal; })
    await this.cabeceraPedidoService.update(cabeceraPedido.id, { total } as UpdateCabeceraPedidoDto)

    return detalleInsert;

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0, orderby = 'id', sordir = 'asc', estado = 'all' } = paginationDto;
    const condition: FindOptionsWhere<DetallePedido> = (estado === 'all' ? {} : JSON.parse(`{"estado": "${(estado === 'active' ? true : false)}" }`))
    const orderBy: FindOptionsOrder<DetallePedido> = JSON.parse(`{${(orderby === 'id' ? ` "cabeceraPedidoId": "${sordir}"` : `"${orderby}":"${sordir}"`)
      }}`)


    return await this.detallePedidoRepository.find({
      take: limit,
      skip: offset,
      order: orderBy,
      where: condition,
      relations: {
        cabeceraPedido: true, producto: true
      }
    })
  }

  async findOne(cabeceraPedidoId: string, productoId: string) {
    let det: DetallePedido;
    det = await this.detallePedidoRepository.findOne({
      where: {
        cabeceraPedidoId,
        productoId
      },
      relations: {
        cabeceraPedido: true,
        producto: true
      }
    });

    if (!det) throw new NotFoundException(`DetallePedido with id [${cabeceraPedidoId},${productoId}] not found`);
    return det;
  }

  async findByCabeceraPedido(idcabpedido: string) {
    return await this.detallePedidoRepository.find({
      where: {
        cabeceraPedidoId: idcabpedido
      },
      relations: {
        cabeceraPedido: true, producto: true
      }
    })
  }

  async update(cabeceraPedidoId: string, productoId: string, updateDetallePedidoDto: UpdateDetallePedidoDto) {
    const { cabeceraPedido, producto, precio, cantidad } = updateDetallePedidoDto;
    const det = await this.findOne(cabeceraPedidoId, productoId);
    updateDetallePedidoDto.cabeceraPedido.id = cabeceraPedidoId;
    updateDetallePedidoDto.producto.id = productoId;
    updateDetallePedidoDto.subtotal =
      (precio ? precio : det.precio) * (cantidad ? cantidad : det.cantidad);
    await this.detallePedidoRepository.update({ cabeceraPedidoId, productoId }, {
      ...updateDetallePedidoDto
    })
    return { ...det, ...updateDetallePedidoDto };

  }

  async remove(cabeceraPedidoId: string, productoId: string) {
    await this.findOne(cabeceraPedidoId, productoId);
    await this.detallePedidoRepository.update({ cabeceraPedidoId, productoId }, { estado: false });
    return { message: `DetallePedido deleted successfully` };

  }

  async createAll(createDetallePedidoDtos: CreateDetallePedidoDto[]) {
    const listIdPros = createDetallePedidoDtos.map(({ producto }) => producto.id)
    const listProductos = (await this.productoRepository.find({ where: { id: In(listIdPros) } })).map(x => x.id)
    const compareList = (a: string[], b: string[]) => a.length === b.length && a.every((x: string, index: number) => x === b[index])
    if (!compareList(listIdPros.sort(), listProductos.sort())) throw new NotFoundException(`DetallePedido with Producto{'id'} [${listIdPros}] not found`);
    const detallePedidos: DetallePedido[] = [];
    createDetallePedidoDtos.forEach(detPedido => {
      detallePedidos.push(this.detallePedidoRepository.create(detPedido))
    });
    return await this.detallePedidoRepository.save(detallePedidos)
  }


  async findDetallePedidoActive(id: string) {
    return await this.detallePedidoRepository.findOne({
      where: {
        cabeceraPedido: {
          id
        },
        estado: true
      }
    });
  }
}
