import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from '../employees/employees.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [
    JwtStrategy, PassportModule, JwtModule, AuthService
  ],
  imports: [
    ConfigModule,
    PassportModule.register({ //PARA EL JWT
      defaultStrategy: 'jwt'
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'), //LLAVE SECRETA NADIE DEBE SABER
          signOptions: {
            expiresIn: '2h' //PARA QUE EXPIRE EN 2H
          }
        }
      }
    }),

    forwardRef(() => EmployeesModule),
    forwardRef(() => UserModule),

  ]

})
export class AuthModule { }
