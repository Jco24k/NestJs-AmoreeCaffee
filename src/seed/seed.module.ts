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
import { ConfigModule } from '@nestjs/config';
import { ProductoImageModule } from 'src/producto-image/producto-image.module';
import { CategoriaImageModule } from 'src/categoria-image/categoria-image.module';
import { EmployeesModule } from 'src/employees/employees.module';
import { RolesModule } from 'src/roles/roles.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    ConfigModule,
    forwardRef(() => CategoriasModule),
    forwardRef(() => CategoriaImageModule),
    forwardRef(() => ClientesModule),
    forwardRef(() => MesaModule),
    forwardRef(() => ProductosModule),
    forwardRef(() => ProductoImageModule),
    forwardRef(() => CabeceraPedidoModule),
    forwardRef(() => ComprobanteModule),
    forwardRef(() => DetallePedidoModule),
    forwardRef(() => EmployeesModule),
    forwardRef(() => RolesModule),
    forwardRef(() => UserModule )


  ]
})
export class SeedModule { }
