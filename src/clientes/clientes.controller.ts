import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post('create')
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll(@Query() paginationDto:PaginationDto ) {
    return this.clientesService.findAll(paginationDto);
  }
  
  @Get(':search')
  findOne(@Param('search') search: string) {
    return this.clientesService.findOne(search);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.clientesService.remove(id);
  }
}
