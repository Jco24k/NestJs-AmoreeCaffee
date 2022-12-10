import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('mesa')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post('create')
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesaService.create(createMesaDto);
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto ) {
    return this.mesaService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mesaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMesaDto: UpdateMesaDto) {
    return this.mesaService.update(id, updateMesaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mesaService.remove(id);
  }
}
