
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class CreateCategoriaDto {

    @ApiProperty({
        example: 'postres',
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

    @ApiProperty({
        example: [
            "https://loremflickr.com/640/480/abstract?lock=82631"
        ],
        description: '"images"',
        nullable: false,
        type: [String],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
