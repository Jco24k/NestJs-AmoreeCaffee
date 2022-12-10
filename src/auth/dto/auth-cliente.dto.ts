import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthClienteDto {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    correo: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}
