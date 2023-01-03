import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Auth, ValidRoles } from '../auth/interfaces';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Employee } from './entities/employee.entity';
import { use } from 'passport';
import { User } from 'src/User/entities/User.entity';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';

@Controller(CurrentPathInterface.empleado)
@ApiTags(CurrentPathInterface.empleado.toUpperCase())
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'Employee is exists in db - "BadRequestException"', type: Employee })
  @ApiResponse({ status: 500, description: 'Can n create Employee - Check Serve Logs - "InternalServerErrorException"', type: Employee })
  @Post('create')
  // @Auth({ roles: [ValidRoles.admin] })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  // @Auth({ roles: [ValidRoles.admin] })
  @Get()
  @ApiBearerAuth()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.employeesService.findAll(paginationDto);
  }
  // @Auth({ employee: true, roles: [ValidRoles.admin] })
  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 404, description: 'Employee with id or dni "###" not found - "NotFoundException"', type: Employee })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }


  // @Auth({ employee:true,roles: [ValidRoles.admin] })
  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 404, description: 'Employee with id or dni "###" not found - "NotFoundException"', type: Employee })
  @ApiResponse({ status: 400, description: 'Employee is exists in db - "BadRequestException"', type: Employee })
  @ApiResponse({ status: 500, description: 'Can n create Employee - Check Serve Logs - "InternalServerErrorException"', type: Employee })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @ApiResponse({ status: 404, description: 'Employee with id or dni "###" not found - "NotFoundException"', type: Employee })
  // @Auth({ roles: [ValidRoles.admin] })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.remove(id);
  }
}
