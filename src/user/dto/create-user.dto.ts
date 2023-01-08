import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, Matches, MaxLength, MinLength, isObject } from "class-validator";
import { Role } from "../../roles/entities/role.entity";
import { Employee } from "src/employees/entities/employee.entity";
import { v4 as uuid } from 'uuid';


export class CreateUserDto {

    @ApiProperty({
        example: { id: uuid() },
        description: '"categoria"',
        type: () => Employee,
        nullable: false
    })
    @IsNotEmptyObject()
    @IsObject()
    @Type(() => Employee)
    empleado: Employee;

    @ApiProperty({
        description: 'User - "username"',
        nullable: false,
        type: String,
        minLength: 6,
        maxLength: 50
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    username: string;



    @ApiProperty({
        description: 'User - "password"',
        nullable: false,
        type: String,
        minLength: 6,
        maxLength: 50,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    password: string;


    @ApiProperty({
        description: 'User - "roles"',
        type: [String],
        nullable: false,
        example: [{ id: uuid() }]
    })
    @IsArray()
    @IsNotEmpty()
    roles: Role[]


    @ApiProperty({
        example: true,
        description: 'User - "estado"',
        type: Boolean,
        default: true
    })
    @IsBoolean()
    @IsOptional()
    estado?: boolean;

}
