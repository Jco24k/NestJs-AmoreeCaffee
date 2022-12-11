import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post('create')
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto ) {
    return this.productosService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(id);
  }

  @Get(':search/:categoria')
  findOnebyCategoria(@Param('search') search: string,@Param('categoria') categoria: string) {
    return this.productosService.findOnebyCategoria(search,categoria);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.productosService.remove(id);
  }

  @Get('/categoria/search/:categoria')
  findAllbyCategoria(@Param('categoria') categoria: string) {
    return this.productosService.findAllbyCategoria(categoria);
  }
}
