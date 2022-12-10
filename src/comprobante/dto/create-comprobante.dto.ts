import { Type } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, MinLength } from "class-validator";
import { CabeceraPedido } from "src/cabecera-pedido/entities/cabecera-pedido.entity";

export class CreateComprobanteDto {

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    @IsOptional()
    tipo:string;

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    nro: string;

    @IsNotEmptyObject()
    @IsObject()
    @Type(() => CabeceraPedido)
    cabeceraPedido: CabeceraPedido;

    @IsBoolean()
    @IsOptional()
    estado: boolean;
}
