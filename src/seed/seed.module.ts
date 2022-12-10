import { forwardRef, Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { ClientesModule } from 'src/clientes/clientes.module';
import { MesaModule } from 'src/mesa/mesa.module';
import { ProductosModule } from 'src/productos/productos.module';
import { CabeceraPedidoModule } from 'src/cabecera-pedido/cabecera-pedido.module';
import { ComprobanteModule } from 'src/comprobante/comprobante.module';
import { DetallePedidoModule } from 'src/detalle-pedido/detalle-pedido.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports:[
    forwardRef(() => CategoriasModule),
    forwardRef(() => ClientesModule),
    forwardRef(() => MesaModule),
    forwardRef(() => ProductosModule),
    forwardRef(() => CabeceraPedidoModule),
    forwardRef(() => ComprobanteModule),
    forwardRef(() => DetallePedidoModule),




  ]
})
export class SeedModule {}
