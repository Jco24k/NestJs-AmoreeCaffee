import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';
import { v4 as uuid } from 'uuid';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
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
