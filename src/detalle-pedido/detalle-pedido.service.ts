import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { number } from 'joi';
import { CabeceraPedidoService } from 'src/cabecera-pedido/cabecera-pedido.service';
import { UpdateCabeceraPedidoDto } from 'src/cabecera-pedido/dto/update-cabecera-pedido.dto';
import { Producto } from 'src/productos/entities/producto.entity';
import { ProductosService } from 'src/productos/productos.service';
import { In, Repository } from 'typeorm';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';
import { DetallePedido } from './entities/detalle-pedido.entity';

@Injectable()
export class DetallePedidoService {

  private readonly logger = new Logger('DetallePedidoService');

  constructor(
    @InjectRepository(DetallePedido)
    private readonly detallePedidoRepository: Repository<DetallePedido>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly cabeceraPedidoService: CabeceraPedidoService,
    private readonly productoService: ProductosService
  ) { }


  async create(createDetallePedidoDto: CreateDetallePedidoDto) {
    const { producto, cabeceraPedido } = createDetallePedidoDto;
    await this.cabeceraPedidoService.findOne(cabeceraPedido.id);
    await this.productoService.findOne(producto.id);
    try {
      const det = this.detallePedidoRepository.create(createDetallePedidoDto);
      const detalleInsert = await this.detallePedidoRepository.save(det);
      const listDetalles = await this.detallePedidoRepository.find({
        where: {
          cabeceraPedidoId: detalleInsert.cabeceraPedidoId
        }
      })
      let total: number = 0;
      listDetalles.forEach((detalle) => { total += detalle.subtotal; })
      await this.cabeceraPedidoService.update(cabeceraPedido.id, { total } as UpdateCabeceraPedidoDto)

      return detalleInsert;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    return await this.detallePedidoRepository.find({
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

  async findByCabeceraPedido(idcabpedido: string){
    return await this.detallePedidoRepository.find({
      where:{
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
    try {
      await this.detallePedidoRepository.update({ cabeceraPedidoId, productoId }, {
        ...updateDetallePedidoDto
      })
      return { ...det, ...updateDetallePedidoDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(cabeceraPedidoId: string, productoId: string) {
    await this.findOne(cabeceraPedidoId, productoId);
    await this.detallePedidoRepository.update({ cabeceraPedidoId, productoId }, { estado: false });
    return { message: `DetallePedido deleted successfully` };

  }

  private handleException(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }


  async createAll(createDetallePedidoDtos: CreateDetallePedidoDto[]) {
    const listIdPros = createDetallePedidoDtos.map(({ producto }) => producto.id)
    const listProductos = (await this.productoRepository.find({ where: { id: In(listIdPros) } })).map(x => x.id)
    const compareList = (a: string[], b: string[]) => a.length === b.length && a.every((x: string, index: number) => x === b[index])
    if (!compareList(listIdPros, listProductos)) throw new NotFoundException(`DetallePedido with Producto{'id'} [${listIdPros}] not found`);
    const detallePedidos: DetallePedido[] = [];
    createDetallePedidoDtos.forEach(detPedido => {
      detallePedidos.push(this.detallePedidoRepository.create(detPedido))
    });
    return await this.detallePedidoRepository.save(detallePedidos)
  }
}
