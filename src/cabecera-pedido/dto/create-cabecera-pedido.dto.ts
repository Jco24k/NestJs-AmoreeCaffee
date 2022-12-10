import { Type } from "class-transformer";
import { IsBoolean, IsDateString, IsIn, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Mesa } from "src/mesa/entities/mesa.entity";
import { CabeceraPedido } from "../entities/cabecera-pedido.entity";

export class CreateCabeceraPedidoDto {

    @IsNotEmptyObject()
    @IsObject()
    @Type(() => Cliente)
    cliente: Cliente;

    @IsString()
    @MinLength(1)
    @IsIn(['efectivo', 'bcp', 'yape'])
    @IsOptional()
    forma_pago: string

    @IsString()
    @MinLength(1)
    @IsIn(['llevar', 'mesa'])
    @IsOptional()
    tipo_pedido: string;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    cliente_pedido: string

    @IsNotEmptyObject()
    @IsObject()
    @IsOptional()
    @Type(() => Mesa)
    mesa ?: Mesa;

    @IsOptional()
    fecha: Date;

    @IsNumber()
    @IsPositive()
    total: number;


    @IsBoolean()
    @IsOptional()
    estado: boolean;
}
