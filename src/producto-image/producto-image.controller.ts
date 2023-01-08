import { Controller, Post, Param, UseInterceptors, UploadedFile, HttpStatus} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFilter } from 'src/common/helpers';
import { maxSizeFile, validFile, validPathImage } from 'src/common/interfaces/valid-file';
import { ProductoImageService } from './producto-image.service';
import { CurrentPathInterface } from 'src/common/interfaces/current-path.interface';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, ValidRoles } from 'src/auth/interfaces';



@Controller(CurrentPathInterface.productoImage)
@ApiTags(CurrentPathInterface.productoImage.toUpperCase())
export class ProductoImageController {

  constructor(
    private readonly productoImageService: ProductoImageService
  ) { }

  @Auth({ roles: [ValidRoles.superUser,ValidRoles.admin] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Upload a "archivo"',
    description: 'This endpoint allows you to upload a "archivo"',
  })
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    description: 'The "archivo" to be uploaded',
  })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Make sure that the file is an image' })
  @ApiBadRequestResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed (uuid is expected)' })
  @ApiOkResponse({ status: HttpStatus.OK, description: 'SecurreUrl: http://localhost:3000/products/85f64f8d-670f-4330-9db8-d8e4a18fdd69.jpeg' })
  
  @Post(':id')
  @UseInterceptors(FileInterceptor('archivo', MulterFilter.options(validFile.IMAGES, validPathImage.products, maxSizeFile.products)))
  uploadFile(
    @UploadedFile() archivo: Express.Multer.File,
    @Param('id') id: string
  ) {
    return this.productoImageService.addImageProducts(archivo, id);
  }


}
