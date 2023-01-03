import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { ValidFindOne } from '../interfaces/validFindOne.interface';

export const END_POINT_VALIDATE = 'find_one';
export const UserProtected = ( validFindOne: ValidFindOne) => {
    return SetMetadata(END_POINT_VALIDATE, validFindOne);
}
