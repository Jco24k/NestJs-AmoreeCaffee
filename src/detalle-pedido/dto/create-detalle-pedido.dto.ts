import { Type } from "class-transformer";
import { IsBoolean, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsPositive } from "class-validator";
import { CabeceraPedido } from "src/cabecera-pedido/entities/cabecera-pedido.entity";
import { Producto } from "src/productos/entities/producto.entity";

export class CreateDetallePedidoDto {


    @IsNotEmptyObject()
    @IsObject()
    @Type(() => CabeceraPedido)
    cabeceraPedido: CabeceraPedido;


    @IsNotEmptyObject()
    @IsObject()
    @Type(() => Producto)
    producto: Producto;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    precio: number;

    @IsNumber()
    @IsPositive()
    cantidad: number;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    subtotal: number;

    @IsBoolean()
    @IsOptional()
    estado:boolean;

}