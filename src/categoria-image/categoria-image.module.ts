import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaImage } from './entities/categoria-image.entity';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([CategoriaImage]),
    ],
    exports: [
        TypeOrmModule
    ]
})
export class CategoriaImageModule { }
