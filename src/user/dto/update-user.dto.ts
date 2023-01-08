import { IsOptional, IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { v4 as uuid } from 'uuid';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {

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
