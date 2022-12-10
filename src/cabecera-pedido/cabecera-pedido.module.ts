import { forwardRef, Module } from '@nestjs/common';
import { CabeceraPedidoService } from './cabecera-pedido.service';
import { CabeceraPedidoController } from './cabecera-pedido.controller';
import { CabeceraPedido } from './entities/cabecera-pedido.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallePedidoModule } from 'src/detalle-pedido/detalle-pedido.module';
import { ClientesModule } from 'src/clientes/clientes.module';
import { MesaModule } from 'src/mesa/mesa.module';
import { ComprobanteModule } from 'src/comprobante/comprobante.module';

@Module({
  controllers: [CabeceraPedidoController],
  providers: [CabeceraPedidoService],
  imports: [
    TypeOrmModule.forFeature([CabeceraPedido]),
    forwardRef(() => DetallePedidoModule),
    forwardRef(() => ClientesModule),
    forwardRef(() => MesaModule),
    forwardRef(() => ComprobanteModule),

  ],
  exports: [
    TypeOrmModule, CabeceraPedidoService
  ]
})
export class CabeceraPedidoModule {}
