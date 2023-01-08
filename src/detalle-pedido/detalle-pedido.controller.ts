import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { DetallePedidoService } from './detalle-pedido.service';
import { CreateDetallePedidoDto } from './dto/create-detalle-pedido.dto';
import { UpdateDetallePedidoDto } from './dto/update-detalle-pedido.dto';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { OrderDetailAttribute } from 'src/common/interfaces/filterPaginationEntitys';
import { Auth, ValidRoles } from 'src/auth/interfaces';

@Controller(CurrentPathInterface.detallePedido)
@ApiTags(CurrentPathInterface.detallePedido.toUpperCase())
export class DetallePedidoController {
  constructor(private readonly detallePedidoService: DetallePedidoService) {}

  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new DetallePedido' })
  @ApiBody({ type: CreateDetallePedidoDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: DetallePedido, description: 'DetallePedido created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'DetallePedido is exists in db - "BadRequestException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Post('create')
  create(@Body() createDetallePedidoDto: CreateDetallePedidoDto) {
    return this.detallePedidoService.create(createDetallePedidoDto);
  }

  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiQuery({ type: PaginationDto, required: false })
  @ApiOperation({ summary: 'Find DetallePedido' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [DetallePedido], description: 'Find DetallePedido' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `orderby must be one of the following values: [${OrderDetailAttribute}]` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'property "x" should not exist- "BadRequestException"' })
  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.detallePedidoService.findAll(paginationDto);
  }
  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne DetallePedido' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'DetallePedido with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: DetallePedido, description: 'FindOne DetallePedido' })
  @Get(':idcabpedido/:idproducto')
  findOne(@Param('idcabpedido',ParseUUIDPipe) idcabpedido: string,@Param('idproducto',ParseUUIDPipe) idproducto: string) {
    return this.detallePedidoService.findOne(idcabpedido,idproducto);
  }

  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'findByCabeceraPedido DetallePedido' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'DetallePedido with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: DetallePedido, description: 'findByCabeceraPedido DetallePedido' })
  @Get('search/cabecerapedido/:idcabpedido')
  findByCabeceraPedido(@Param('idcabpedido',ParseUUIDPipe) idcabpedido: string) {
    return this.detallePedidoService.findByCabeceraPedido(idcabpedido);
  }

  @Auth({ roles: [ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateDetallePedidoDto })
  @ApiOperation({ summary: 'Update DetallePedido' })
  @ApiOkResponse({ status: HttpStatus.OK, type: DetallePedido, description: 'Update DetallePedido' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'DetallePedido with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Patch(':idcabpedido/:idproducto')
  update(@Param('idcabpedido',ParseUUIDPipe) idcabpedido: string,@Param('idproducto',ParseUUIDPipe) idproducto: string
  , @Body() updateDetallePedidoDto: UpdateDetallePedidoDto) {
    return this.detallePedidoService.update(idcabpedido,idproducto, updateDetallePedidoDto);
  }

  @Auth({ roles: [ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete DetallePedido' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Delete DetallePedido' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'DetallePedido with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `DetallePedido with id 96856f1e-94f5-463b-acfa-e7f17db5770e cannot be deleted because it is in use.` })
  @Delete(':idcabpedido/:idproducto')
  remove(@Param('idcabpedido',ParseUUIDPipe) idcabpedido: string,@Param('idproducto',ParseUUIDPipe) idproducto: string) {
    return this.detallePedidoService.remove(idcabpedido,idproducto);
  }


  @Auth({ roles: [ValidRoles.admin] })
  
  @ApiBearerAuth()
  @ApiOperation({ summary: 'CreateAll new DetallePedido' })
  @ApiBody({ type: [CreateDetallePedidoDto] })
  @ApiResponse({ status: HttpStatus.CREATED, type: [DetallePedido], description: 'DetallePedido created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'DetallePedido is exists in db - "BadRequestException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Post('createall')
  createAll(@Body() createDetallePedidoDto: CreateDetallePedidoDto[]) {
    return this.detallePedidoService.createAll(createDetallePedidoDto);
  }
}
