import { forwardRef, Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { DetallePedidoModule } from 'src/detalle-pedido/detalle-pedido.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ProductosController],
  providers: [ProductosService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Producto]),
    forwardRef(() => CategoriasModule),
    forwardRef(() => DetallePedidoModule)

  ],
  exports: [
    TypeOrmModule, ProductosService
  ]
})
export class ProductosModule {}
