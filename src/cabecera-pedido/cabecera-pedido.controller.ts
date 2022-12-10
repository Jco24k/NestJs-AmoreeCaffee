import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { CabeceraPedidoService } from './cabecera-pedido.service';
import { CreateCabeceraPedidoDto } from './dto/create-cabecera-pedido.dto';
import { UpdateCabeceraPedidoDto } from './dto/update-cabecera-pedido.dto';

@Controller('cabpedido')
export class CabeceraPedidoController {
  constructor(private readonly cabeceraPedidoService: CabeceraPedidoService) {}

  @Post('create')
  create(@Body() createCabeceraPedidoDto: CreateCabeceraPedidoDto) {
    return this.cabeceraPedidoService.create(createCabeceraPedidoDto);
  }

  @Get()
  findAll() {
    return this.cabeceraPedidoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cabeceraPedidoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateCabeceraPedidoDto: UpdateCabeceraPedidoDto) {
    return this.cabeceraPedidoService.update(id, updateCabeceraPedidoDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.cabeceraPedidoService.remove(id);
  }
}
