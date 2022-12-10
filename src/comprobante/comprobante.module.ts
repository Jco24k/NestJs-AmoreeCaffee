import { forwardRef, Module } from '@nestjs/common';
import { ComprobanteService } from './comprobante.service';
import { ComprobanteController } from './comprobante.controller';
import { Comprobante } from './entities/comprobante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabeceraPedidoModule } from 'src/cabecera-pedido/cabecera-pedido.module';

@Module({
  controllers: [ComprobanteController],
  providers: [ComprobanteService],
  imports: [
    TypeOrmModule.forFeature([ Comprobante]),
    forwardRef(() => CabeceraPedidoModule),

  ],
  exports: [
    TypeOrmModule, ComprobanteService
  ]
})
export class ComprobanteModule {}
