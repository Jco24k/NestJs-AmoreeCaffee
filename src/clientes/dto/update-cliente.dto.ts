import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateClienteDto } from './create-cliente.dto';

export class UpdateClienteDto extends PartialType(CreateClienteDto) {
    @IsOptional()
    @IsUUID()
    id: string;
}
