import { Type } from "class-transformer";
import { IsBoolean, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPositive } from "class-validator";
import { CabeceraPedido } from "src/cabecera-pedido/entities/cabecera-pedido.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';

export class CreateDetallePedidoDto {


    @ApiProperty({
        example: { id: uuid() },
        description: '"cabeceraPedido"',
        type: () => CabeceraPedido,
        nullable: false
    })
    @IsNotEmptyObject()
    @IsObject()
    @Type(() => CabeceraPedido)
    cabeceraPedido: CabeceraPedido;

    @ApiProperty({
        example: { id: uuid() },
        description: '"producto"',
        type: () => Producto,
        nullable: false
    })
    @IsNotEmptyObject()
    @IsObject()
    @Type(() => Producto)
    producto: Producto;

    @ApiProperty({
        example: 12.50,
        description: '"precio"',
        nullable:false,
        type: Number

    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    precio: number;

    @ApiProperty({
        example: 3,
        description: '"cantidad"',
        nullable:false,
        type: Number

    })
    @IsNumber()
    @IsPositive()
    cantidad: number;

    @ApiProperty({
        example: 37.50,
        description: '"subtotal"',
        nullable:false,
        type: Number

    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    subtotal: number;

    @ApiProperty({
        example: true,
        description: '"estado"',
        default: true,
    })
    @IsBoolean()
    @IsOptional()
    estado:boolean;

}