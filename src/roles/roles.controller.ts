import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseFilters } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Auth, ValidRoles } from '../auth/interfaces';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { QueryFailedFilter } from 'src/common/exception/query-exception-filter';
import { HttpExceptionFilter } from 'src/common/exception/http-exception-filter';

@Controller(CurrentPathInterface.rol)
@ApiTags(CurrentPathInterface.rol.toUpperCase())
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @ApiBearerAuth()
  @Post('create')

  @ApiResponse({ status: 400, description: 'Role is exists in db - "BadRequestException"', type: Role })
  @ApiResponse({ status: 500, description: 'Can n create Role - Check Serve Logs - "InternalServerErrorException"', type: Role })

  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiBearerAuth()
  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.rolesService.findAll(paginationDto);
  }

  @ApiBearerAuth()
  @Get(':search')
  @ApiResponse({ status: 404, description: 'Role with id or dni "###" not found - "NotFoundException"', type: Role })
  findOne(@Param('search') search: string) {
    return this.rolesService.findOne(search);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiResponse({ status: 404, description: 'Role with id or dni "###" not found - "NotFoundException"', type: Role })
  @ApiResponse({ status: 400, description: 'Role is exists in db - "BadRequestException"', type: Role })
  @ApiResponse({ status: 500, description: 'Can n create Role - Check Serve Logs - "InternalServerErrorException"', type: Role })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiResponse({ status: 404, description: 'Role with id "###" not found - "NotFoundException"', type: Role })
  @ApiResponse({ status: 500, description: 'Role with id "###" cannot be deleted because it is in use. - "InternalServerErrorException"', type: Role })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
