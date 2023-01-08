import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMesaDto {
    @ApiProperty({
        example: 'jesus',
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
        type: Boolean,
    })
    @IsBoolean()
    @IsOptional()
    estado?: boolean;
}
