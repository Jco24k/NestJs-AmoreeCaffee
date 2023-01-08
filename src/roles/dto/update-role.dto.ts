import { IsOptional, IsUUID } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';
import { v4 as uuid } from 'uuid';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsOptional()
    @IsUUID()
    @ApiProperty({
        example: uuid(),
        description: ' id "(uuid)"',
        required: false,
        type: String
    })
    id: string;
}
