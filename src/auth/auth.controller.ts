import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller(CurrentPathInterface.auth)
@ApiTags(CurrentPathInterface.auth.toUpperCase())
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(200)
  @ApiOperation({ summary: 'Authentication' })
  @ApiBody({ type: AuthUserDto })
  @ApiUnauthorizedResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Auth UnauthorizedException' })
  @ApiResponse({ status: HttpStatus.OK, type: AuthUserDto, description: 'Login correctamente' })
  @Post()
  signIn(@Body() loginUserDto: AuthUserDto) {
    return this.authService.auth(loginUserDto);
  }
  
}
