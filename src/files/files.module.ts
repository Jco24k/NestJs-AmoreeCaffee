import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from 'src/productos/productos.module';
import { MulterFilter } from './helpers';

@Module({
  controllers: [FilesController],
  providers: [FilesService], 
  imports: [
    ConfigModule, 
    forwardRef(()=> ProductosModule)
  
  ]

})
export class FilesModule { }
