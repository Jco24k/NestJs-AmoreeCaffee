import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

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
    @IsIn(['nombre','id'])
    @IsOptional()
    orderby ?: string;

    @IsString()
    @IsIn(['asc','desc'])
    @IsOptional()
    sordir ?: string
}