import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, HttpStatus } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Auth, ValidRoles } from '../auth/interfaces';
import { Employee } from './entities/employee.entity';
import { use } from 'passport';
import { User } from 'src/User/entities/User.entity';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmployeeAttribute } from 'src/common/interfaces/filterPaginationEntitys';

@Controller(CurrentPathInterface.empleado)
@ApiTags(CurrentPathInterface.empleado.toUpperCase())
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new Employee' })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: Employee, description: 'Employee created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Employee is exists in db - "BadRequestException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Post('create')
  @Auth({ roles: [ValidRoles.admin] })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Auth({ roles: [ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiQuery({ type: PaginationDto, required: false })
  @ApiOperation({ summary: 'Find Employee' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [Employee], description: 'Find Employee' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `orderby must be one of the following values: [${EmployeeAttribute}]` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'property "x" should not exist- "BadRequestException"' })
  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.employeesService.findAll(paginationDto);
  }
  @Auth({ employee: true, roles: [ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne Employee' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Employee with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Employee, description: 'FindOne Employee' })
  @Get(':id')

  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }


  @Auth({ employee:true,roles: [ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiOperation({ summary: 'Update Employee' })
  @ApiOkResponse({ status: HttpStatus.OK, type: Employee, description: 'Update Employee' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Employee with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  
  @Auth({ roles: [ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Employee' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Delete Employee' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Employee with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `Employee with id 96856f1e-94f5-463b-acfa-e7f17db5770e cannot be deleted because it is in use.` })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.employeesService.remove(id);
  }
}
