import { forwardRef, Module } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { MesaController } from './mesa.controller';
import { Mesa } from './entities/mesa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabeceraPedidoModule } from 'src/cabecera-pedido/cabecera-pedido.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MesaController],
  providers: [MesaService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Mesa]),
  ],
  exports: [
    TypeOrmModule, MesaService
  ]
})
export class MesaModule {}
