import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { UserModule } from '../user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Role]),
     forwardRef(() => UserModule)

  ],
  exports: [TypeOrmModule,RolesService]
})
export class RolesModule {}
