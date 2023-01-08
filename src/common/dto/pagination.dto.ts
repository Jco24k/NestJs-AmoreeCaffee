import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsNumber, IsObject, IsOptional, IsPositive, IsString, Min } from "class-validator";
import { CurrentPathInterface } from "../interfaces/current-path.interface";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    @ApiProperty({
        example: 1,
        description: '"limit data"',
        default: 1,
        required: false,
        type: () => Number
    })
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    @ApiProperty({
        example: 0,
        description: '"limit data"',
        default: 0,
        required: false,
        type: () => Number
    })
    offset?: number;


    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'id',
        description: `sort by selected property`,
        default: 'id',
        required: false,
        type: () => String
    })
    orderby?: string;

    @IsString()
    @IsOptional()
    @IsIn(['asc', 'desc'])
    @ApiProperty({
        example: 'asc',
        description: `sordir ['asc','desc']`,
        default: 'asc',
        required: false,
        type: () => String
    })
    sordir?: string

    @IsOptional()
    @IsIn(['all', 'inactive',"active"])
    @IsString()
    @ApiProperty({
        example: 'all',
        description: `estado ['all', 'inactive',"active"]`,
        default: 'all',
        required: false,
        type: () => String
    })
    estado : string
}