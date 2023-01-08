import { IsOptional, IsUUID } from 'class-validator';
import { CreateCategoriaDto } from './create-categoria.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
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
