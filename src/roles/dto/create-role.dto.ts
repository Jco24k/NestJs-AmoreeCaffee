import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateRoleDto {

    
    @ApiProperty({
        description: 'Role nombre',
        nullable: false,
        type: String,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    nombre: string;


    @ApiProperty({
        description: 'Role estado',
        type: Boolean,
        default:true
    })
    @IsOptional()
    @IsBoolean()
    estado: boolean;


}
