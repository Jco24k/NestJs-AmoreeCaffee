import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, applyDecorators } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Mesa } from './entities/mesa.entity';
import { TableAttribute } from 'src/common/interfaces/filterPaginationEntitys';
import { Auth, ValidRoles } from 'src/auth/interfaces';

@Controller(CurrentPathInterface.mesa)
@ApiTags(CurrentPathInterface.mesa.toUpperCase())
export class MesaController {
  constructor(private readonly mesaService: MesaService) { }

  @Auth({ roles: [ValidRoles.user, ValidRoles.superUser, ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Mesa' })
  @ApiBody({ type: CreateMesaDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Mesa, description: 'Mesa created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Mesa is exists in db - "BadRequestException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Post('create')
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesaService.create(createMesaDto);
  }

  @Auth({ roles: [ValidRoles.user, ValidRoles.superUser, ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiQuery({ type: PaginationDto, required: false })
  @ApiOperation({ summary: 'Find Mesa' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [Mesa], description: 'Find Mesa' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `orderby must be one of the following values: [${TableAttribute}]` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'property "x" should not exist- "BadRequestException"' })
  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.mesaService.findAll(paginationDto);
  }

  @Auth({ roles: [ValidRoles.user, ValidRoles.superUser, ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne Mesa' })
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Mesa, description: 'FindOne Mesa' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Mesa with id or nombre "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mesaService.findOne(id);
  }
  @Auth({ roles: [ValidRoles.user, ValidRoles.superUser, ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateMesaDto })
  @ApiOperation({ summary: 'Update Mesa' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Mesa, description: 'Update Mesa' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Mesa with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMesaDto: UpdateMesaDto) {
    return this.mesaService.update(id, updateMesaDto);
  }


  @Auth({ roles: [ValidRoles.user, ValidRoles.superUser, ValidRoles.admin] })

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Mesa' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Delete Mesa' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Mesa with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mesaService.remove(id);
  }
}
