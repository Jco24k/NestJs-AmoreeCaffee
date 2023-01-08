import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseFilters, HttpStatus } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Auth, ValidRoles } from '../auth/interfaces';
import { Role } from './entities/role.entity';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { QueryFailedFilter } from 'src/common/exception/query-exception-filter';
import { HttpExceptionFilter } from 'src/common/exception/http-exception-filter';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolAttribute } from 'src/common/interfaces/filterPaginationEntitys';

@Controller(CurrentPathInterface.rol)
@ApiTags(CurrentPathInterface.rol.toUpperCase())
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

@Auth({ roles: [ValidRoles.admin] })
@ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Role' })
  @ApiBody({ type: CreateRoleDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Role, description: 'Role created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Role is exists in db - "BadRequestException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Post('create')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }


@Auth({ roles: [ValidRoles.admin] })
@ApiBearerAuth()
  @ApiQuery({ type: PaginationDto, required: false })
  @ApiOperation({ summary: 'Find Role' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [Role], description: 'Find Role' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `orderby must be one of the following values: [${RolAttribute}]` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'property "x" should not exist- "BadRequestException"' })
  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.rolesService.findAll(paginationDto);
  }

@Auth({ roles: [ValidRoles.admin] })
@ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne Role' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Role with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Role, description: 'FindOne Role' })
  @Get(':search')
  findOne(@Param('search') search: string) {
    return this.rolesService.findOne(search);
  }

@Auth({ roles: [ValidRoles.admin] })
@ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiOperation({ summary: 'Update Role' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Role, description: 'Update Role' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Role with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

@Auth({ roles: [ValidRoles.admin] })
@ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Role' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Delete Role' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Role with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `Role with id 96856f1e-94f5-463b-acfa-e7f17db5770e cannot be deleted because it is in use.` })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
