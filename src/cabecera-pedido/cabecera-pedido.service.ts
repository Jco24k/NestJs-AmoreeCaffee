import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientesService } from 'src/clientes/clientes.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MesaService } from 'src/mesa/mesa.service';
import { Repository } from 'typeorm';
import { CreateCabeceraPedidoDto } from './dto/create-cabecera-pedido.dto';
import { UpdateCabeceraPedidoDto } from './dto/update-cabecera-pedido.dto';
import { CabeceraPedido } from './entities/cabecera-pedido.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class CabeceraPedidoService {
  private readonly logger = new Logger('CabeceraPedidoService');

  constructor(
    @InjectRepository(CabeceraPedido)
    private readonly cabeceraPedidoRepository: Repository<CabeceraPedido>,
    private readonly clienteService: ClientesService,
    private readonly mesaService: MesaService
  ) { }


  async create(createCabeceraPedidoDto: CreateCabeceraPedidoDto) {
    const { cliente, mesa } = createCabeceraPedidoDto;
    createCabeceraPedidoDto.cliente = await this.clienteService.findOne(cliente.id);
    if (mesa)
      createCabeceraPedidoDto.mesa = await this.mesaService.findOne(mesa.nombre);
    try {
      const cab = this.cabeceraPedidoRepository.create(createCabeceraPedidoDto);
      return await this.cabeceraPedidoRepository.save(cab);

    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    return await this.cabeceraPedidoRepository.find({
      relations: {
        cliente: true, mesa: true
      }
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
    if (cliente)
      await this.clienteService.findOne(!cliente.id ? '' : cliente.id);
    if (mesa)
      await this.mesaService.findOne(!mesa.id ? '' : mesa.id);
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
    await this.cabeceraPedidoRepository.update({ id }, { estado: false });
    return { message: `CabeceraPedido with id ${id} deleted successfully` };

  }

  private handleException(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
