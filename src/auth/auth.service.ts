import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../User/entities/User.entity';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtPayload } from './interfaces';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
  ) {

  }
  async auth(authUserDto: AuthUserDto) {
    const { password, username } = authUserDto;
    // VERIFICAR EN BD 
    const user = await this.userModel.findOne(
      {
        where: { username: username },
        select: { username: true, password: true, id: true }
      }
    );
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid (username)');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid (password)');
    }

    return {
      ...user,//ESPARCIR LASVARIABLES DEL USUARIO
      token: this.getJwtToken({ id: user.id })
    };
  }


  getJwtToken(payload: JwtPayload) { return this.jwtService.sign(payload) }

}
