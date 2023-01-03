import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, BadRequestException, UseFilters } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { AuthUserDto } from './dto/auth-user.dto';
import { User } from 'src/User/entities/User.entity';
import { Auth, ValidRoles } from './interfaces';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterPagination } from '../common/decorators/filter-pagination-decorator';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { ParseFilterAll } from 'src/common/pipes/parse-filter-all.pipe';
import { QueryFailedFilter } from 'src/common/exception/query-exception-filter';

@Controller(CurrentPathInterface.auth)
@ApiTags(CurrentPathInterface.auth.toUpperCase())
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  @ApiResponse({ status: 401, description: 'Auth UnauthorizedException', type: AuthUserDto })
  @HttpCode(200)
  signIn(@Body() loginUserDto: AuthUserDto) {
    return this.authService.auth(loginUserDto);
  }

  @Get()
  @UseFilters(new QueryFailedFilter())
  prueba(){
    throw new BadRequestException('prueba')
  }
}
