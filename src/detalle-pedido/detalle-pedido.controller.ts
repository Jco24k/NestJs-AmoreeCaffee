import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { DetallePedidoService } from './detalle-pedido.service';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller(CurrentPathInterface.detallePedido)
export class DetallePedidoController {
  constructor(private readonly detallePedidoService: DetallePedidoService) {}

  @Post('create')
  create(@Body() createDetallePedidoDto: CreateDetallePedidoDto) {
    return this.detallePedidoService.create(createDetallePedidoDto);
  }

  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.detallePedidoService.findAll(paginationDto);
  }

  @Get(':idcabpedido/:idproducto')
  findOne(@Param('idcabpedido',ParseUUIDPipe) idcabpedido: string,@Param('idproducto',ParseUUIDPipe) idproducto: string) {
    return this.detallePedidoService.findOne(idcabpedido,idproducto);
  }

  @Get('search/cabecerapedido/:idcabpedido')
  findByCabeceraPedido(@Param('idcabpedido',ParseUUIDPipe) idcabpedido: string) {
    return this.detallePedidoService.findByCabeceraPedido(idcabpedido);
  }

  @Patch(':idcabpedido/:idproducto')
  update(@Param('idcabpedido',ParseUUIDPipe) idcabpedido: string,@Param('idproducto',ParseUUIDPipe) idproducto: string
  , @Body() updateDetallePedidoDto: UpdateDetallePedidoDto) {
    return this.detallePedidoService.update(idcabpedido,idproducto, updateDetallePedidoDto);
  }

  @Delete(':idcabpedido/:idproducto')
  remove(@Param('idcabpedido',ParseUUIDPipe) idcabpedido: string,@Param('idproducto',ParseUUIDPipe) idproducto: string) {
    return this.detallePedidoService.remove(idcabpedido,idproducto);
  }


  @Post('createall')
  createAll(@Body() createDetallePedidoDto: CreateDetallePedidoDto[]) {
    return this.detallePedidoService.createAll(createDetallePedidoDto);
  }
}
