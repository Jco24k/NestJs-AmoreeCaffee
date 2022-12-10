import { PartialType } from '@nestjs/mapped-types';
import { CreateCabeceraPedidoDto } from './create-cabecera-pedido.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateCabeceraPedidoDto extends PartialType(CreateCabeceraPedidoDto) {

    @IsOptional()
    @IsUUID()
    id: string;
}

