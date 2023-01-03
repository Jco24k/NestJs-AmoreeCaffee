import { Controller, Post, Param, UseInterceptors, UploadedFile} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFilter } from 'src/common/helpers';
import { maxSizeFile, validFile, validPathImage } from 'src/common/interfaces/valid-file';
import { ProductoImageService } from './producto-image.service';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';



@Controller(CurrentPathInterface.productoImage)
export class ProductoImageController {

  constructor(
    private readonly productoImageService: ProductoImageService
  ) { }

  @Post(':id')
  @UseInterceptors(FileInterceptor('archivo', MulterFilter.options(validFile.IMAGES, validPathImage.products, maxSizeFile.products)))
  uploadFile(
    @UploadedFile() archivo: Express.Multer.File,
    @Param('id') id: string
  ) {
    return this.productoImageService.addImageProducts(archivo, id);
  }


}
