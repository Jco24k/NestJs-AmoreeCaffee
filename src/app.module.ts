import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CommonModule } from './common/common.module';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ClientesModule } from './clientes/clientes.module';
import { CategoriasModule } from './categorias/categorias.module';
import { ProductosModule } from './productos/productos.module';
import { CabeceraPedidoModule } from './cabecera-pedido/cabecera-pedido.module';
import { MesaModule } from './mesa/mesa.module';
import { ComprobanteModule } from './comprobante/comprobante.module';
import { DetallePedidoModule } from './detalle-pedido/detalle-pedido.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SeedModule } from './seed/seed.module';
import { ProductoImageModule } from './producto-image/producto-image.module';
import { CategoriaImageModule } from './categoria-image/categoria-image.module';
import { Employee } from './employees/entities/employee.entity';
import { EmployeesModule } from './employees/employees.module';
import { RolesModule } from './roles/roles.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot( 
      {
        load: [EnvConfiguration],
        validationSchema: JoiValidationSchema 
      }
    ),
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    CommonModule,
    AuthModule,
    EmployeesModule,
    RolesModule,
    UserModule,
    ClientesModule,
    CategoriasModule,
    ProductosModule,
    CabeceraPedidoModule,
    MesaModule,
    ComprobanteModule,
    DetallePedidoModule,
    FilesModule,
    ProductoImageModule,
    CategoriaImageModule,
    SeedModule,
  ]
})
export class AppModule {}
