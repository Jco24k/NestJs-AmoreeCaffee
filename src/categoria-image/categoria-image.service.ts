import { BadRequestException, Inject, Injectable, InternalServerErrorException, forwardRef } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CategoriasService } from "src/categorias/categorias.service";
import { validPathImage } from "src/common/interfaces/valid-file";
import { validate as isUUID } from 'uuid';
import { FilesService } from "src/files/files.service";


@Injectable()
export class CategoriaImageService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => CategoriasService))
    private readonly categoriaService: CategoriasService,
    @Inject(forwardRef(() => FilesService))
    private readonly filesService: FilesService,
  ) { }
  async addImageCategories(archivo: Express.Multer.File, idcat: string) {
    if (!archivo) throw new BadRequestException('Make sure that the file is an image')
    let { filename } = archivo;
    try {
      if (!isUUID(idcat)) throw new BadRequestException('Validation failed (uuid is expected)');
      const cat = await this.categoriaService.findOne(idcat);
      const secureUrl = `${this.configService.get<String>('HOST_API')}/${validPathImage.categories}/${archivo.filename}`;
      await this.categoriaService.addImage(archivo.filename, cat.id);
      return { secureUrl }
    } catch (error) {
      this.filesService.deleteImage(filename, validPathImage.categories)
      this.handleException(error)
    }
  }


  private handleException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.message);

    throw new InternalServerErrorException(error.message);
  }


}
