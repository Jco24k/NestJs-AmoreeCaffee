import { IsOptional, IsUUID } from 'class-validator';
import { CreateMesaDto } from './create-mesa.dto';
import { v4 as uuid } from 'uuid';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateMesaDto extends PartialType(CreateMesaDto) {

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
