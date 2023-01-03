import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, Matches, MaxLength, MinLength, isObject } from "class-validator";
import { Role } from "../../roles/entities/role.entity";
import { Employee } from "src/employees/entities/employee.entity";


export class CreateUserDto {
    
    @ApiProperty({
        description: 'User - "id_employee"',
        nullable: false,
        type: String,
        minLength: 1
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
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    
    @ApiProperty({
        description: 'User - "roles"',
        type: [String],
        nullable: false
    })
    @IsArray()
    @IsNotEmpty()
    roles: Role[]


    @ApiProperty({
        description: 'User - "estado"',
        type: Boolean,
        default:true
    })
    @IsBoolean()
    @IsOptional()
    estado?: boolean;

}
