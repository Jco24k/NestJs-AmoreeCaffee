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
@Module({
  imports: [
    ConfigModule.forRoot( 
      {
        load: [EnvConfiguration],
        validationSchema: JoiValidationSchema 
      }
    ),
    DatabaseModule,
    CommonModule,
    AuthModule,
    ClientesModule,
    CategoriasModule,
    ProductosModule,
    CabeceraPedidoModule,
    MesaModule,
    ComprobanteModule,
    DetallePedidoModule,
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      //SI EN LA CARPETA PUBLIC HAY IMAGENES SE PUEDEN ACCEDER
    //MEIDANTE LA URL EJEMPLO: http://localhost:3000/products/1473809-00-A_1_2000.jpg
    }),
    SeedModule,
  ]
})
export class AppModule {}
