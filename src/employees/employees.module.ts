import { forwardRef, Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([Employee]),
     forwardRef(() => RolesModule),
     forwardRef(() => AuthModule),
     forwardRef(() => UserModule),


  ],
  exports: [TypeOrmModule, EmployeesService]
})
export class EmployeesModule {}
