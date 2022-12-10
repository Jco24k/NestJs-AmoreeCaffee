
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class CreateCategoriaDto {

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    nombre: string;
    @IsBoolean()
    @IsOptional()
    estado?: boolean;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    imagenUrl ?:string;
}
