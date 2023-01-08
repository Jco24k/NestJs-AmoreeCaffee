import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { CreateComprobanteDto } from './dto/create-comprobante.dto';
import { UpdateComprobanteDto } from './dto/update-comprobante.dto';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Comprobante } from './entities/comprobante.entity';
import { VoucherAttribute } from 'src/common/interfaces/filterPaginationEntitys';
import { Auth, ValidRoles } from 'src/auth/interfaces';

@Controller(CurrentPathInterface.comprobamte)
@ApiTags(CurrentPathInterface.comprobamte.toUpperCase())

export class ComprobanteController {
  constructor(private readonly comprobanteService: ComprobanteService) {}

  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Comprobante' })
  @ApiBody({ type: CreateComprobanteDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Comprobante, description: 'Comprobante created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Comprobante is exists in db - "BadRequestException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Post('create')
  create(@Body() createComprobanteDto: CreateComprobanteDto) {
    return this.comprobanteService.create(createComprobanteDto);
  }
  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiQuery({ type: PaginationDto, required: false })
  @ApiOperation({ summary: 'Find Comprobante' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [Comprobante], description: 'Find Comprobante' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `orderby must be one of the following values: [${VoucherAttribute}]` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'property "x" should not exist- "BadRequestException"' })
  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.comprobanteService.findAll(paginationDto);
  }

@Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })
@ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne Comprobante' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Comprobante with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Comprobante, description: 'FindOne Comprobante' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comprobanteService.findOne(id);
  }

@Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })
@ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateComprobanteDto })
  @ApiOperation({ summary: 'Update Comprobante' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Comprobante, description: 'Update Comprobante' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Comprobante with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateComprobanteDto: UpdateComprobanteDto) {
    return this.comprobanteService.update(id, updateComprobanteDto);
  }

@Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })
@ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Comprobante' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Delete Comprobante' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Comprobante with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `Comprobante with id 96856f1e-94f5-463b-acfa-e7f17db5770e cannot be deleted because it is in use.` })
  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.comprobanteService.remove(id);
  }
}
