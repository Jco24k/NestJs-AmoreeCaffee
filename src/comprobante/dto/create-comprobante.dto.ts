import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, MinLength } from "class-validator";
import { CabeceraPedido } from "src/cabecera-pedido/entities/cabecera-pedido.entity";
import { v4 as uuid } from 'uuid';

export class CreateComprobanteDto {

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    @IsOptional()
    @ApiProperty({
        example: "boleta",
        description: '"tipo"',
        default: "boleta",
        type: String

    })
    tipo:string;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    @ApiProperty({
        example: "10053548605",
        description: '"nro"',
        nullable:false,
        type: String

    })
    nro: string;

    @IsNotEmptyObject()
    @IsObject()
    @Type(() => CabeceraPedido)
    @ApiProperty({
        example: { id: uuid() },
        description: '"cabeceraPedido"',
        type: () => CabeceraPedido,
        nullable: false
    })
    cabeceraPedido: CabeceraPedido;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({
        example: true,
        description: '"estado"',
        default: true,
    })
    estado: boolean;
}
