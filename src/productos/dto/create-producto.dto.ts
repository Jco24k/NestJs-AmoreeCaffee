import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Categoria } from "src/categorias/entities/categoria.entity";

export class CreateProductoDto {
    

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    nombre:string;


    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    @IsOptional()
    descripcion:string;

    @IsNumber()
    @IsPositive()
    precio:number;

    @IsNumber()
    @IsPositive()
    cantidad:number;

    @IsNotEmptyObject()
    @IsObject()
    @Type(() => Categoria)
    categoria: Categoria;

    @IsBoolean()
    @IsOptional()
    estado:boolean;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    imagenUrl ?:string;
}
