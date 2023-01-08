import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoriaDto } from 'src/categorias/dto/create-categoria.dto';
import { Cliente } from './entities/cliente.entity';
import { UpdateCategoriaDto } from 'src/categorias/dto/update-categoria.dto';
import { ClientAttribute } from 'src/common/interfaces/filterPaginationEntitys';
import { Auth, ValidRoles } from 'src/auth/interfaces';

@Controller(CurrentPathInterface.cliente)
@ApiTags(CurrentPathInterface.cliente.toUpperCase())
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) { }
  @Auth({ roles: [ValidRoles.user, ValidRoles.superUser, ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Cliente' })
  @ApiBody({ type: CreateClienteDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Cliente, description: 'Cliente created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cliente is exists in db - "BadRequestException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Post('create')
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Auth({ roles: [ValidRoles.user, ValidRoles.superUser, ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiQuery({ type: PaginationDto, required: false })
  @ApiOperation({ summary: 'Find Cliente' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [Cliente], description: 'Find Cliente' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `orderby must be one of the following values: [${ClientAttribute}]` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'property "x" should not exist- "BadRequestException"' })
  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.clientesService.findAll(paginationDto);
  }
  
  @Auth({ roles: [ValidRoles.user, ValidRoles.superUser, ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne Cliente' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Cliente, description: 'FindOne Cliente' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Cliente with id or correo "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(id);
  }

  @Auth({ roles: [ValidRoles.user, ValidRoles.superUser, ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateClienteDto })
  @ApiOperation({ summary: 'Update Cliente' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Cliente, description: 'Update Cliente' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Cliente with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clientesService.update(id, updateClienteDto);
  }


  @Auth({ roles: [ValidRoles.user, ValidRoles.superUser, ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Cliente' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Delete Cliente' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Cliente with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientesService.remove(id);
  }
}
