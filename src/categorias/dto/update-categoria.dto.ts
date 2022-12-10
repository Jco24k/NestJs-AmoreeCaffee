import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateCategoriaDto } from './create-categoria.dto';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
    @IsOptional()
    @IsUUID()
    id: string;
}
