import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post('create')
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto ) {
    return this.categoriasService.findAll(paginationDto);
  }

  @Get(':search')
  findOne(@Param('search') search: string) {
    return this.categoriasService.findOne(search);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.categoriasService.remove(id);
  }
}
