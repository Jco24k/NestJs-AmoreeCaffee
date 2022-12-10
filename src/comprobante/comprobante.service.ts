import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CabeceraPedidoService } from 'src/cabecera-pedido/cabecera-pedido.service';
import { CabeceraPedido } from 'src/cabecera-pedido/entities/cabecera-pedido.entity';
import { Repository } from 'typeorm';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';
import { Comprobante } from './entities/comprobante.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ComprobanteService {
  constructor(
    @InjectRepository(Comprobante)
    private readonly comprobanteRepository: Repository<Comprobante>,
    private readonly cabeceraPedidoService: CabeceraPedidoService
  ) { }


  async create(createComprobanteDto: CreateComprobanteDto) {
    const { estado, ...detailsCab } = await this.cabeceraPedidoService.findOne(createComprobanteDto.cabeceraPedido.id);
    try {
      const Comprobante = this.comprobanteRepository.create(createComprobanteDto);
      return { ...(await this.comprobanteRepository.save(Comprobante)), cabeceraPedido: detailsCab };

    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    return await this.comprobanteRepository.find({
      relations: {
        cabeceraPedido: true
      }
    });
  }

  async findOne(search: string) {
    let comprobante: Comprobante;
    if (isUUID(search)) {
      comprobante = await this.comprobanteRepository.findOneBy({ id: search });
    } else {
      comprobante = await this.comprobanteRepository.findOne({
        where: { nro: search.toLowerCase()}
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
      updateComprobanteDto.cabeceraPedido  = await this.cabeceraPedidoService.findOne(cabeceraPedido.id);
    }
    try {
      await this.comprobanteRepository.update({ id }, {
        ...updateComprobanteDto
      })
      return { ...comprobante, ...updateComprobanteDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.comprobanteRepository.update({ id }, { estado: false });
    return { message: `Comprobante with id ${id} deleted successfully` };

  }

  private handleException(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
