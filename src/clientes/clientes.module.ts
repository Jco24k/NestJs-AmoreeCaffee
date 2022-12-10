import { forwardRef, Module } from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { Cliente } from './entities/cliente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetallePedidoModule } from 'src/detalle-pedido/detalle-pedido.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ClientesController],
  providers: [ClientesService],
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    forwardRef(() => DetallePedidoModule),
    forwardRef(()=> AuthModule)
  ],
  exports: [
    TypeOrmModule, ClientesService
  ]
})
export class ClientesModule { }
