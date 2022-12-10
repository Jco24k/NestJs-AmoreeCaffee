import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateMesaDto } from './create-mesa.dto';

export class UpdateMesaDto extends PartialType(CreateMesaDto) {

    @IsOptional()
    @IsUUID()
    id: string;
}
