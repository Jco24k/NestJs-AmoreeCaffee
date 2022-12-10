import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateComprobanteDto } from './create-comprobante.dto';

export class UpdateComprobanteDto extends PartialType(CreateComprobanteDto) {
    @IsOptional()
    @IsUUID()
    id: string;
}
