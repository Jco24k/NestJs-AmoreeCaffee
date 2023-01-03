import { Controller, Post, Param, UseInterceptors, UploadedFile, BadRequestException, ParseUUIDPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EnvConfiguration } from 'src/config/env.config';
import { CategoriaImageService } from './categoria-image.service';
import { MulterFilter } from 'src/common/helpers';
import { maxSizeFile, validFile, validPathImage } from 'src/common/interfaces/valid-file';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';



@Controller(CurrentPathInterface.categoriaImage)
export class CategoriaImageController {

  constructor(
    private readonly categoriaImageService: CategoriaImageService
    ) {}

    @Post(':id')
 @UseInterceptors(FileInterceptor('archivo', MulterFilter.options(validFile.IMAGES,validPathImage.categories, maxSizeFile.categories)))
    uploadFile(
      @UploadedFile() archivo: Express.Multer.File,
      @Param('id') id: string
    ) {
      return this.categoriaImageService.addImageCategories(archivo,id);
    }


}
