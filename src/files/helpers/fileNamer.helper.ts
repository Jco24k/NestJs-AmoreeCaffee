import { v4 as uuid } from "uuid";
//ESTE ARCHIVO NO LEVANTA UN ERROR, SOLO VALIDA EL ARCHIVO ENVIADO
//EN CASO ESTE INCORRECTO EN EL CONTROLLER VA A SALIR EL ARCHIVO ENVIADO UNDEFINED
export const fileNamer = (
    req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if(!file) return callback(new Error('File is empty'),false)
    const fileExtension = file.mimetype.split('/')[1];
    const filename = `${uuid()}.${fileExtension}`;
    callback(null, filename);
}