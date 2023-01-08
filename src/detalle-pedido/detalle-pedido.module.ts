import { forwardRef, Module } from '@nestjs/common';
import { DetallePedidoService } from './detalle-pedido.service';
import { DetallePedidoController } from './detalle-pedido.controller';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from 'src/productos/productos.module';
import { CabeceraPedidoModule } from 'src/cabecera-pedido/cabecera-pedido.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DetallePedidoController],
  providers: [DetallePedidoService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([ DetallePedido]),
    forwardRef(() => CabeceraPedidoModule),
    forwardRef(() => ProductosModule),
    forwardRef(()=> AuthModule)

  ],
  exports: [
    TypeOrmModule, DetallePedidoService
  ]
})
export class DetallePedidoModule {}
