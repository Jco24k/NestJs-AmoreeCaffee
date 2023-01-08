import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus } from '@nestjs/common';
import { ParseUUIDPipe } from '@nestjs/common/pipes';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Categoria } from './entities/categoria.entity';
import { CategoryAttribute } from 'src/common/interfaces/filterPaginationEntitys';
import { Auth, ValidRoles } from 'src/auth/interfaces';


@ApiTags(CurrentPathInterface.categoria.toUpperCase())
@Controller(CurrentPathInterface.categoria)
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) { }

  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Categoria' })
  @ApiBody({ type: CreateCategoriaDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Categoria, description: 'Categoria created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Categoria is exists in db - "BadRequestException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Post('create')
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto);
  }

  @Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiQuery({ type: PaginationDto, required: false })
  @ApiOperation({ summary: 'Find Categoria' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [Categoria], description: 'Find Categoria' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `orderby must be one of the following values: [${CategoryAttribute}]` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'property "x" should not exist- "BadRequestException"' })
  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.categoriasService.findAll(paginationDto);
  }

  @Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne Categoria' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Categoria with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Categoria, description: 'FindOne Categoria' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriasService.findCategoriaImage(id);
  }

  @Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateCategoriaDto })
  @ApiOperation({ summary: 'Update Categoria' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Categoria, description: 'Update Categoria' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Categoria with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiNotFoundResponse({ status: HttpStatus.BAD_REQUEST, description: 'Image - Url not valid' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoriaDto: UpdateCategoriaDto) {
    return this.categoriasService.update(id, updateCategoriaDto);
  }

  @Auth({ roles: [ValidRoles.user,ValidRoles.superUser,ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Categoria' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Delete Categoria' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Categoria with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `Categoria with id 96856f1e-94f5-463b-acfa-e7f17db5770e cannot be deleted because it is in use.` })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriasService.remove(id);
  }
}
