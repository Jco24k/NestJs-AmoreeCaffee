import { forwardRef, Module } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { MesaController } from './mesa.controller';
import { Mesa } from './entities/mesa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CabeceraPedidoModule } from 'src/cabecera-pedido/cabecera-pedido.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MesaController],
  providers: [MesaService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Mesa]),
    forwardRef(()=> AuthModule)

  ],
  exports: [
    TypeOrmModule, MesaService
  ]
})
export class MesaModule {}
