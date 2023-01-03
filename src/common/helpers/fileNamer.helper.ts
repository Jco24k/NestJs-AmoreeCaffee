import { v4 as uuid } from "uuid";
import { validFile } from "../interfaces/valid-file";

export const fileNamer = (
    req: Express.Request, file: Express.Multer.File, callback: Function) => {
    if (!file) return callback(new Error('File is empty'), false)
    const fileExtension = file.mimetype.split('/')[1];
    const filename = `${uuid()}.${fileExtension}`;
    callback(null, filename);
}

