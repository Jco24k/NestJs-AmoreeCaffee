import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';

@Controller('comprobante')
export class ComprobanteController {
  constructor(private readonly comprobanteService: ComprobanteService) {}

  @Post('create')
  create(@Body() createComprobanteDto: CreateComprobanteDto) {
    return this.comprobanteService.create(createComprobanteDto);
  }

  @Get()
  findAll() {
    return this.comprobanteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comprobanteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateComprobanteDto: UpdateComprobanteDto) {
    return this.comprobanteService.update(id, updateComprobanteDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.comprobanteService.remove(id);
  }
}
