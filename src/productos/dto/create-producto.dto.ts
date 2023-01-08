import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Categoria } from "src/categorias/entities/categoria.entity";
import { v4 as uuid } from 'uuid';
 
export class CreateProductoDto {
    

    @ApiProperty({
        example: 'gaseosa',
        description: '"nombre"',
        nullable: false,
        type: String,
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    nombre:string;

    @ApiProperty({
        example: '3L inca Kola',
        description: '"descripcion"',
        nullable: false,
        type: String,
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    @IsOptional()
    descripcion:string;

    @ApiProperty({
        example: 12.50,
        description: '"precio"',
        nullable:false,
        type: Number

    })
    @IsNumber()
    @IsPositive()
    precio:number;


    @ApiProperty({
        example: 3,
        description: '"cantidad"',
        nullable:false,
        type: Number

    })
    @IsNumber()
    @IsPositive()
    cantidad:number;

    @ApiProperty({
        example: { id: uuid() },
        description: '"categoria"',
        type: () => Categoria,
        nullable: false
    })
    @IsNotEmptyObject()
    @IsObject()
    @Type(() => Categoria)
    categoria: Categoria;

    @ApiProperty({
        example: true,
        description: '"estado"',
        default: true,
        type: Boolean
    })
    @IsBoolean()
    @IsOptional()
    estado:boolean;


    @ApiProperty({
        example: [
            "https://loremflickr.com/640/480/abstract?lock=82631"
        ],
        description: '"images"',
        nullable: false,
        type: [String],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
