import { Controller, Post, Param, UseInterceptors, UploadedFile, BadRequestException, ParseUUIDPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EnvConfiguration } from 'src/config/env.config';
import { FilesService } from './files.service';
import { fileNamer, MulterFilter } from './helpers';
import { validFile } from './interfaces/valid-file';


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
    ) {}

    @Post('product/:id')
    @UseInterceptors(FileInterceptor('archivo', MulterFilter.options(validFile.IMAGES, 5)))
    uploadFile(
      @UploadedFile() archivo: Express.Multer.File,
      @Param('id') id: string
    ) {
      
      return this.filesService.insertImageProducts(archivo,id);
    }


}
