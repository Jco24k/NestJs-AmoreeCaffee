import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CategoriaImageService } from './categoria-image.service';
import { CategoriasModule } from 'src/categorias/categorias.module';
import { CategoriaImageController } from './categoria-image.controller';
import { FilesService } from 'src/files/files.service';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    controllers: [CategoriaImageController],
    providers: [CategoriaImageService],
    imports: [
        ConfigModule,
        forwardRef(() => CategoriasModule),
        forwardRef(() => FilesModule),
        forwardRef(()=> AuthModule)


    ],
    exports: [
        CategoriaImageService
    ]
})
export class CategoriaImageModule { }
