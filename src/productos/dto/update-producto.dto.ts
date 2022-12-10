import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {

    @IsOptional()
    @IsUUID()
    id: string;
}
