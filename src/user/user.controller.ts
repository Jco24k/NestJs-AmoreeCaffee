import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';
import { User } from './entities/User.entity';
import { string } from 'joi';
import { Auth, ValidRoles } from 'src/auth/interfaces';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { QueryFailedFilter } from 'src/common/exception/query-exception-filter';
import { HttpExceptionFilter } from 'src/common/exception/http-exception-filter';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAttribute } from 'src/common/interfaces/filterPaginationEntitys';

@Controller(CurrentPathInterface.user)
@ApiTags(CurrentPathInterface.user.toUpperCase())
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new User' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: User, description: 'User created successfully' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'User is exists in db - "BadRequestException"' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Auth({ roles: [ValidRoles.admin] })
  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  
  @ApiBearerAuth()
  @ApiQuery({ type: PaginationDto, required: false })
  @ApiOperation({ summary: 'Find User' })
  @ApiOkResponse({ status: HttpStatus.OK, type: [User], description: 'Find User' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `orderby must be one of the following values: [${UserAttribute}]` })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'property "x" should not exist- "BadRequestException"' })
  @Auth({ roles: [ValidRoles.admin] })
  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'FindOne User' })
  @ApiParam({ name: 'id' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'User with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiOkResponse({ status: HttpStatus.OK, type: User, description: 'FindOne User' })
  @ApiResponse({ status: 404, description: 'User with id "###" not found - "NotFoundException"', type: User })
  @Auth({ user: true, roles: [ValidRoles.admin] })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }


  @ApiBearerAuth()
  @ApiParam({ name: 'id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: 'Update User' })
  @ApiOkResponse({ status: HttpStatus.OK, type: User, description: 'Update User' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'User with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiNotFoundResponse({ status: HttpStatus.BAD_REQUEST, description: 'Image - Url not valid' })
  @ApiInternalServerErrorResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Can n create - Check Serve Logs - "InternalServerErrorException"' })
  @Auth({ user: true, roles: [ValidRoles.admin] })
  @Patch(':id')
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }


  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete User' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'Delete User' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'User with id "96856f1e-94f5-463b-acfa-e7f17db5770e" not found - "NotFoundException"' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: `User with id 96856f1e-94f5-463b-acfa-e7f17db5770e cannot be deleted because it is in use.` })
  @Auth({ roles: [ValidRoles.admin] })
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
