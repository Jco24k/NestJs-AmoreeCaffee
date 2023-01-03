import { BadRequestException, Inject, Injectable, InternalServerErrorException, forwardRef } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CategoriasService } from "src/categorias/categorias.service";
import { validPathImage } from "src/common/interfaces/valid-file";
import { validate as isUUID } from 'uuid';
import { FilesService } from "src/files/files.service";
import { ProductosService } from "src/productos/productos.service";


@Injectable()
export class ProductoImageService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => ProductosService))
    private readonly productsService: ProductosService,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
  ) {

  }
  async addImageProducts(archivo: Express.Multer.File, idcat: string) {
    if (!archivo) throw new BadRequestException('Make sure that the file is an image')
    let { filename } = archivo;
    try {
      if (!isUUID(idcat)) throw new BadRequestException('Validation failed (uuid is expected)');
      const cat = await this.productsService.findOne(idcat);
      const secureUrl = `${this.configService.get<String>('HOST_API')}/${validPathImage.products}/${archivo.filename}`;
      await this.productsService.addImage(archivo.filename, cat.id);
      return { secureUrl }
    } catch (error) {
      this.filesService.deleteImage(filename, validPathImage.products)
      this.handleException(error)
    }
  }


  private handleException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.message);

    throw new InternalServerErrorException(error.message);
  }


}
