import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateMesaDto {
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    nombre: string;
    @IsBoolean()
    @IsOptional()
    estado?: boolean;
}
