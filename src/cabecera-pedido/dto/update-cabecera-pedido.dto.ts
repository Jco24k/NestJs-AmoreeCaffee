import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCabeceraPedidoDto } from './create-cabecera-pedido.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { v4 as uuid } from 'uuid';

export class UpdateCabeceraPedidoDto extends PartialType(CreateCabeceraPedidoDto) {

    @IsOptional()
    @IsUUID()
    @ApiProperty({
        example: uuid(),
        description: ' id "(uuid)"',
        required:false,
        type: String
    })
    id: string;
}

