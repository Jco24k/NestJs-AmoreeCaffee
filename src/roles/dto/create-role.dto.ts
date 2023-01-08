import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateRoleDto {

    
    @ApiProperty({
        example: 'admin',
        description: '"nombre"',
        nullable: false,
        type: String,
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    nombre: string;


    @ApiProperty({
        example: true,
        description: '"estado"',
        default: true,
        type: Boolean
    })
    @IsOptional()
    @IsBoolean()
    estado: boolean;


}
