import { IsOptional, IsUUID } from 'class-validator';
import { CreateClienteDto } from './create-cliente.dto';
import { v4 as uuid } from 'uuid';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
    
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
