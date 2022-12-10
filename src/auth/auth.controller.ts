import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthClienteDto } from './dto/auth-cliente.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() loginClienteDto: AuthClienteDto) {
    return this.authService.auth(loginClienteDto);
  }


}
