import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { EmailSeed } from './dto/email-seed.dto';


@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  SeedExecute(@Body() emailSeed: EmailSeed) {
    return this.seedService.seedExecute(emailSeed);
  }

}
