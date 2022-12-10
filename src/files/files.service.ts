import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { ProductosService } from 'src/productos/productos.service';
import { Repository } from 'typeorm';
import { join } from 'path';
import { Console } from 'console';
import * as fs from 'fs';
import { validate as isUUID } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    private readonly productoService: ProductosService

  ) { }
  async insertImageProducts(archivo: Express.Multer.File, idpro: string) {
    if (!archivo) throw new BadRequestException('Make sure that the file is an image')
    let { filename } = archivo;
    try {
      if(!isUUID(idpro)) throw  new BadRequestException('Validation failed (uuid is expected)');
      const pro = await this.productoService.findOne(idpro);
      if (pro.imagenUrl) this.deleteImage(pro.imagenUrl)
      const secureUrl = `${this.configService.get<String>('HOST_API')}/productos/${archivo.filename}`;
      await this.productoRepository.update({ id: idpro }, { imagenUrl: archivo.filename });
      return { secureUrl }

    } catch (error) {
      this.deleteImage(filename)
      this.handleException(error)
    }
  }


  deleteImage(fileName: string) {
    const path = join(__dirname, '../..', process.env.UPLOAD_LOCATION, fileName)
    fs.unlink(path, () => { })
  }

  private handleException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.message);

    throw new BadRequestException(error.message);
  }
}
