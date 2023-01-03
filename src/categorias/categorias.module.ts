import { forwardRef, Module } from '@nestjs/common';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';
import { Categoria } from './entities/categoria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosModule } from 'src/productos/productos.module';
import { ConfigModule } from '@nestjs/config';
import { CategoriaImageModule } from 'src/categoria-image/categoria-image.module';
import { CategoriaImage } from './entities/categoria-image.entity';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Categoria, CategoriaImage]),
    forwardRef(() => ProductosModule),
    forwardRef(() => CategoriaImageModule),
    forwardRef(() => FilesModule)
    
  ],
  exports: [
    TypeOrmModule, CategoriasService,

  ]
})
export class CategoriasModule { }
