import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailSeed {

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
