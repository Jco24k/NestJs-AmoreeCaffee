import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { PhoneValid } from "src/common/validator/phone_valid.validator";

export class CreateClienteDto {

    @IsString()
    @MinLength(1)
    nombre: string;
    @IsString()
    @MinLength(1)
    apellidos: string;

  

    @IsString()
    @IsNotEmpty()
    @PhoneValid('telefono', { message: 'telefono must start with the number "9" and have 9 digits' })
    telefono: string;


    @IsString()
    @MinLength(5)
    @IsEmail()
    correo: string;
    @IsString()
    @MinLength(5)
    password: string;
    @IsBoolean()
    @IsOptional()
    estado?: boolean;

}
