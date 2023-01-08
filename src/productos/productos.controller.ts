import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Producto } from './entities/producto.entity';
import { ProductAttribute } from 'src/common/interfaces/filterPaginationEntitys';
import { Auth, ValidRoles } from 'src/auth/interfaces';

@ApiTags(CurrentPathInterface.producto.toUpperCase())
@Controller(CurrentPathInterface.producto)
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}


@Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
@ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Producto' })
  @ApiBody({ type: CreateProductoDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Producto, description: 'Producto created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Producto is exists in db - "BadRequestException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Post('create')
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

@Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
@ApiBearerAuth()
  @ApiQuery({ type: PaginationDto, required: false })
  @ApiOperation({ summary: 'Find Producto' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [Producto], description: 'Find Producto' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `orderby must be one of the following values: [${ProductAttribute}]` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'property "x" should not exist- "BadRequestException"' })
  @Get() 
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.productosService.findAll(paginationDto);
  }

@Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
@ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne Producto' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Producto with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Producto, description: 'FindOne Producto' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productosService.findProductImage(id);
  }

@Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
@ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne por Categoria' })
  @ApiParam({ name: 'search' })
  @ApiParam({ name: 'categoria' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Producto with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Producto, description: 'FindOne Producto' })
  @Get(':search/:categoria')
  findOnebyCategoria(@Param('search') search: string,@Param('categoria') categoria: string) {
    return this.productosService.findOnebyCategoria(search,categoria);
  }

@Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
@ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateProductoDto })
  @ApiOperation({ summary: 'Update Producto' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Producto, description: 'Update Producto' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Producto with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiNotFoundResponse({ status: HttpStatus.BAD_REQUEST, description: 'Image - Url not valid' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }


@Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
@ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Producto' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Delete Producto' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Producto with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `Producto with id 96856f1e-94f5-463b-acfa-e7f17db5770e cannot be deleted because it is in use.` })
  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.productosService.remove(id);
  }

@Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
@ApiBearerAuth()
  @ApiOperation({ summary: 'findAllbyCategoria por Categoria' })
  @ApiParam({ name: 'categoria' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Producto with categoria nombre "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Producto, description: 'findAllbyCategoria Producto' })
  @Get('/categoria/search/:categoria')
  findAllbyCategoria(@Param('categoria') categoria: string) {
    return this.productosService.findAllbyCategoria(categoria);
  }
}
