import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseFilters } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseMongoIdPipe } from '../common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/User.entity';
import { string } from 'joi';
import { Auth, ValidRoles } from 'src/auth/interfaces';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { FilterPagination } from 'src/common/decorators/filter-pagination-decorator';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { QueryFailedFilter } from 'src/common/exception/query-exception-filter';
import { HttpExceptionFilter } from 'src/common/exception/http-exception-filter';

@Controller(CurrentPathInterface.user)
@ApiTags(CurrentPathInterface.user.toUpperCase())
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('create')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'User is exists in db - "BadRequestException"', type: User })
  @ApiResponse({ status: 500, description: 'Can n create User - Check Serve Logs - "InternalServerErrorException"', type: User })
  // @Auth({ roles: [ValidRoles.admin] })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Auth({ roles: [ValidRoles.admin] })

  @ApiBearerAuth()
  @Get()
  findAll(@FilterPagination(ParseFilterAll) paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @ApiBearerAuth()
  @ApiResponse({ status: 404, description: 'User with id "###" not found - "NotFoundException"', type: User })
  @Get(':id')
  // @Auth({ user: true, roles: [ValidRoles.admin] })

  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }


  // @Auth({ user: true, roles: [ValidRoles.admin] })
  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({ status: 404, description: 'User with id or username "###" not found - "NotFoundException"', type: User })
  @ApiResponse({ status: 400, description: 'User is exists in db - "BadRequestException"', type: User })
  @ApiResponse({ status: 500, description: 'Can n create User - Check Serve Logs - "InternalServerErrorException"', type: User })
  @ApiParam({ name: "id", type: String })
  update(@Param('id', ParseMongoIdPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }


  // @Auth({ roles: [ValidRoles.admin] })
  @ApiResponse({ status: 404, description: 'User with id "###" not found - "NotFoundException"', type: User })
  @ApiBearerAuth()
  @ApiParam({ name: "id", type: String })
  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
