import { forwardRef, Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from 'src/productos/productos.module';
// import { MulterFilter } from './helpers';

@Module({
  providers: [FilesService], 
  imports: [
    ConfigModule, 
  ],
  exports: [
    FilesService
  ]

})
export class FilesModule { }
