import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { CabeceraPedidoService } from './cabecera-pedido.service';
import { CreateCabeceraPedidoDto } from './dto/create-cabecera-pedido.dto';
import { UpdateCabeceraPedidoDto } from './dto/update-cabecera-pedido.dto';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';

@Controller(CurrentPathInterface.cabeceraPedido)
export class CabeceraPedidoController {
  constructor(private readonly cabeceraPedidoService: CabeceraPedidoService) {}

  @Post('create')
  create(@Body() createCabeceraPedidoDto: CreateCabeceraPedidoDto) {
    return this.cabeceraPedidoService.create(createCabeceraPedidoDto);
  }

  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.cabeceraPedidoService.findAll(paginationDto);
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
