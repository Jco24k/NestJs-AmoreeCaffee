import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Repository } from 'typeorm';
import { AuthClienteDto } from './dto/auth-cliente.dto';
import { JwtPayload } from './interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ){ }

  async auth(authClienteDto: AuthClienteDto){
    const { password, correo} = authClienteDto;
    const cli = await this.clienteRepository.findOne({
      where:{
        correo: correo
      },
      select: { correo: true,password: true, id: true }
    }
    );

    if(!cli){
      throw new UnauthorizedException('Credentials are not valid (correo)');
    }
    if(!bcrypt.compareSync(password,cli.password)){
      throw new UnauthorizedException('Credentials are not valid (password)');
    }
    return {
      ...cli,
      token:this.getJwtToken({id: cli.id})
    };
  }



   getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
}
