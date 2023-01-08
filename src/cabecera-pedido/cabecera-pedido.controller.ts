import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { CabeceraPedidoService } from './cabecera-pedido.service';
import { CreateCabeceraPedidoDto } from './dto/create-cabecera-pedido.dto';
import { UpdateCabeceraPedidoDto } from './dto/update-cabecera-pedido.dto';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CabeceraPedido } from './entities/cabecera-pedido.entity';
import { v4 as uuid } from 'uuid';
import { HttpExceptionFilter } from 'src/common/exception/http-exception-filter';
import { OrderHeaderAttribute } from 'src/common/interfaces/filterPaginationEntitys';
import { string } from 'joi';
import { Auth, ValidRoles } from 'src/auth/interfaces';

@Controller(CurrentPathInterface.cabeceraPedido)
@ApiTags(CurrentPathInterface.cabeceraPedido.toUpperCase())
export class CabeceraPedidoController {
  constructor(private readonly cabeceraPedidoService: CabeceraPedidoService) { }

  @Post('create')
  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new CabeceraPedido' })
  @ApiBody({ type: CreateCabeceraPedidoDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: CabeceraPedido, description: 'CabeceraPedido created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'CabeceraPedido is exists in db - "BadRequestException"' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `Cliente with 'id' 96856f1e-94f5-463b-acfa-e7f17db5770e inactive - BadRequestException` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `Mesa with 'id' 96856f1e-94f5-463b-acfa-e7f17db5770e inactive - BadRequestException` })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Cliente with id not found - "NotFoundException"' })
  create(@Body() createCabeceraPedidoDto: CreateCabeceraPedidoDto) {
    return this.cabeceraPedidoService.create(createCabeceraPedidoDto);
  }

  @Get()
  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiQuery({ type: PaginationDto, required: false })
  @ApiOperation({ summary: 'Find CabeceraPedido' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [CabeceraPedido], description: 'Find CabeceraPedido' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `orderby must be one of the following values: [${OrderHeaderAttribute}]` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'property "x" should not exist- "BadRequestException"' })
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.cabeceraPedidoService.findAll(paginationDto);
  }

  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne CabeceraPedido' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'CabeceraPedido with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: CabeceraPedido, description: 'FindOne CabeceraPedido' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cabeceraPedidoService.findOne(id);
  }

  @Auth({ roles: [ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateCabeceraPedidoDto })
  @ApiOperation({ summary: 'Update CabeceraPedido' })
  @ApiOkResponse({ status: HttpStatus.OK, type: CabeceraPedido, description: 'Update CabeceraPedido' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'CabeceraPedido with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'CabeceraPedido with mesa id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'CabeceraPedido with cliente id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `Cliente with 'id' 96856f1e-94f5-463b-acfa-e7f17db5770e inactive` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `Mesa with 'id' 96856f1e-94f5-463b-acfa-e7f17db5770e inactive` })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCabeceraPedidoDto: UpdateCabeceraPedidoDto) {
    return this.cabeceraPedidoService.update(id, updateCabeceraPedidoDto);
  }

  @Auth({ roles: [ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'CabeceraPedido with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Delete CabeceraPedido' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `CabeceraPedido with id 96856f1e-94f5-463b-acfa-e7f17db5770e cannot be deleted because it is in use.` })
  @ApiOperation({ summary: 'Delete CabeceraPedido' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cabeceraPedidoService.remove(id);
  }
}
