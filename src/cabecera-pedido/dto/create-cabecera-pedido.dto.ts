import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsIn, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Mesa } from "src/mesa/entities/mesa.entity";
import { CabeceraPedido } from "../entities/cabecera-pedido.entity";
import { ApiProperty } from "@nestjs/swagger";
import { boolean, number } from "joi";

export class CreateCabeceraPedidoDto {

    @ApiProperty({
        example: {
            "id": "96856f1e-94f5-463b-acfa-e7f17db5770e"
        },
        description: '"cliente"',
        nullable: false,
        type: ()=>Cliente,
    })
    @IsNotEmptyObject()
    @IsObject()
    @Type(() => Cliente)
    cliente: Cliente;


    @ApiProperty({
        example: 'efectivo',
        description: '"forma_pago"',
        nullable: false,
        type: String,
    })
    @IsString()
    @MinLength(1)
    @IsIn(['efectivo', 'bcp', 'yape'])
    @IsOptional()
    forma_pago: string

    @IsString()
    @MinLength(1)
    @IsIn(['llevar', 'mesa'])
    @IsOptional()
    @ApiProperty({
        example: 'llevar',
        description: '"forma_pago"',
        nullable: false,
        type: String,
    })
    tipo_pedido: string;

    @ApiProperty({
        example: 'juan',
        description: '"cliente_pedido"',
        nullable: false,
        type: String,
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    cliente_pedido: string


    @ApiProperty({
        example: {
            "id": "96856f1e-94f5-463b-acfa-e7f17db5770e"
        },
        description: '"mesa"',
        nullable: true,
        type: Mesa,
    })
    @IsNotEmptyObject()
    @IsObject()
    @IsOptional()
    @Type(() => Mesa)
    mesa ?: Mesa;


    @ApiProperty({
        example: new Date(),
        description: '"mesa"',
        default: new Date(),
        type: Date,
    })
    @IsOptional()
    fecha: Date;

    @ApiProperty({
        example: 20*12.2,
        description: '"total"',
        nullable: false,
        type: Number,
    })
    @IsNumber()
    @IsPositive()
    total: number;

    @ApiProperty({
        example: true,
        description: '"estado"',
        default: true,
        type: Boolean,
    })
    @IsBoolean()
    @IsOptional()
    estado: boolean;
}
