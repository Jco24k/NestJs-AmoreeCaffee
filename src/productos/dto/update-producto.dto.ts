import { CreateProductoDto } from './create-producto.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { v4 as uuid } from 'uuid';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {

    @IsOptional()
    @IsUUID()
    @ApiProperty({
        example: uuid(),
        description: ' id "(uuid)"',
        required: false,
        type: String
    })
    id: string;
}
