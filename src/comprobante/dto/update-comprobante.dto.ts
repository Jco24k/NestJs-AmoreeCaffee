import { IsOptional, IsUUID } from 'class-validator';
import { CreateComprobanteDto } from './create-comprobante.dto';
import { v4 as uuid } from 'uuid';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateComprobanteDto extends PartialType(CreateComprobanteDto) {
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
