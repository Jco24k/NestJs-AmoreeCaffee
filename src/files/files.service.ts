import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { ProductosService } from 'src/productos/productos.service';
import { Repository } from 'typeorm';
import { join } from 'path';
import * as fs from 'fs';
import { validate as isUUID } from 'uuid';
import { validPathImage } from 'src/common/interfaces/valid-file';

@Injectable()
export class FilesService {
  
  public deleteImage(fileName: string,pathString:string) {
    const path = join(__dirname, '../..', process.env.UPLOAD_LOCATION + '/' + pathString, fileName)
    fs.unlink(path, () => { })
  }


  public deleteAllImage(images: string[], pathString: string){
    images.forEach(x => this.deleteImage(x,pathString))
  }
}
