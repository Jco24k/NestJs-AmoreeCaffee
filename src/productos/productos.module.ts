import { forwardRef, Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { DetallePedidoModule } from 'src/detalle-pedido/detalle-pedido.module';
import { ConfigModule } from '@nestjs/config';
import { ProductoImageModule } from 'src/producto-image/producto-image.module';
import { ProductoImage } from './entities/producto-image.entity';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Producto,ProductoImage]),
    forwardRef(() => CategoriasModule),
    forwardRef(() => DetallePedidoModule),
    forwardRef(()=> ProductoImageModule),
    forwardRef(()=> FilesModule),
    forwardRef(()=> AuthModule)


  ],
  exports: [
    TypeOrmModule, ProductosService
  ]
})
export class ProductosModule {}
