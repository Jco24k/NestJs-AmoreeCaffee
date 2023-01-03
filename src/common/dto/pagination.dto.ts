import { Type } from "class-transformer";
import { IsIn, IsNumber, IsObject, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    offset?: number;


    @IsString()
    @IsOptional()
    orderby ?: string;

    @IsString()
    @IsOptional()
    @IsIn(['asc','desc'])
    sordir ?: string

    @IsObject()
    estado ?:Object
}