import { Module, forwardRef } from '@nestjs/common';
import { ProductoImage } from '../productos/entities/producto-image.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoImageController } from './producto-image.controller';
import { ProductoImageService } from './producto-image.service';
import { ProductosModule } from 'src/productos/productos.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [ProductoImageController],
  providers: [ProductoImageService],
  imports: [
    ConfigModule,
    forwardRef(() => ProductosModule),
    forwardRef(() => FilesModule)
  ],
  exports: [
    ProductoImageService
  ]
})
export class ProductoImageModule { }
