import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UserSeed } from './dto/email-seed.dto';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';


@ApiTags(CurrentPathInterface.seed.toUpperCase())
@Controller(CurrentPathInterface.seed)
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiUnauthorizedResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Auth UnauthorizedException' })
  @ApiResponse({ status: HttpStatus.OK, type: UserSeed, description: 'seedExecute' })
  SeedExecute(@Body() userSeed: UserSeed) {
    return this.seedService.seedExecute(userSeed);
  }

}
