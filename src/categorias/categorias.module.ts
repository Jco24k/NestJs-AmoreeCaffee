import { forwardRef, Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Categoria } from './entities/categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from 'src/productos/productos.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Categoria]),
    forwardRef(() => ProductosModule),
  ],
  exports: [
    TypeOrmModule, CategoriasService,

  ]
})
export class CategoriasModule {}
