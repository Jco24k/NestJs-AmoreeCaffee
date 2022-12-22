import { Module } from '@nestjs/common';
import { ProductoImage } from './entities/producto-image.entity';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([ProductoImage]),
      ],
      exports: [
        TypeOrmModule
      ]
})
export class ProductoImageModule {}
