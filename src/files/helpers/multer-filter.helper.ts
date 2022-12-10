import { diskStorage } from "multer";
import { fileNamer } from "./fileNamer.helper";
import { Injectable } from "@nestjs/common";
import { existsSync, mkdirSync } from 'fs';
import { join } from "path";
import { Request } from 'express';


@Injectable()
export class MulterFilter {
    static options = (validFile:string, max_fileSize:number) => ({
        fileFilter: (
            req: Request, file: Express.Multer.File, callback: Function) => {
            if(!file) return callback(new Error('File is empty'),false)
            const fileExtension = file.mimetype.split('/')[1];
            const validExtesion = validFile.split('|');
            if(validExtesion.includes(fileExtension)){
                return callback(null,true)
            }
            callback(null, false);
        },
        limits:  {
            fileSize: max_fileSize * 1024 * 1024,
        },
        storage: diskStorage({
            destination: (req:  Request, file: Express.Multer.File, cb: Function) => {
                const path = join(__dirname, '../../..',process.env.UPLOAD_LOCATION)
                if (!existsSync(path)) mkdirSync(path);
                cb(null, path);
            },
            filename: fileNamer
        })
    })

}