import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength, IsNotEmpty, IsOptional, IsBoolean, IsEmail, IsNumber, Matches, IsArray, maxLength } from "class-validator";
import { IsDniValid } from "../../common/validator/isdnivalid.validator";
import { PhoneValid } from "../../common/validator/phone_valid.validator";

export class CreateEmployeeDto {

    @ApiProperty({
        description: 'Employee nombre',
        nullable: false,
        type: String,
        minLength: 1
    })
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    @Matches(/^[ a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/, { message: 'nombre must contain only letters' })
    nombre: string;
    
    @ApiProperty({
        description: 'Employee telefono',
        nullable: false,
        type: String,
        minLength: 9,
        maxLength:9
    })
    @IsString()
    @IsNotEmpty()
    @PhoneValid('telefono', { message: 'telefono must start with the number "9" and have 9 digits' })
    telefono: string;


    @ApiProperty({
        description: 'Employee dni',
        nullable: false,
        type: String,
        minLength: 8,
        maxLength:8
    })
    @IsDniValid('dni', { message: 'dni must be to 8 digits' })
    dni: string;
    
    @ApiProperty({
        description: 'Employee estado',
        type: Boolean,
        default:true
    })
    @IsBoolean()
    @IsOptional()
    estado?: boolean;

}
