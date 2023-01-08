import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { PhoneValid } from "src/common/validator/phone_valid.validator";

export class CreateClienteDto {

     @ApiProperty({
        example: 'jesus',
        description: '"nombre"',
        nullable: false,
        type: String,
    })
    @IsString()
    @MinLength(1)
    nombre: string;

     @ApiProperty({
        example: 'coronado',
        description: '"apellidos"',
        nullable: false,
        type: String,
    })
    @IsString()
    @MinLength(1)
    apellidos: string;

  

     @ApiProperty({
        example: '999666333',
        description: '"telefono"',
        maxLength: 9,
        minLength: 9,
        nullable: false,
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @PhoneValid('telefono', { message: 'telefono must start with the number "9" and have 9 digits' })
    telefono: string;


     @ApiProperty({
        example: 'coronado@gmail.com',
        description: '"correo"',
        nullable: false,
        type: String,
    })
    @IsString()
    @MinLength(5)
    @IsEmail()
    correo: string;
    @IsString()
    @MinLength(5)
     @ApiProperty({
        example: 'asdasdEsadzDEas_123',
        description: '"password"',
        nullable: false,
        type: String,
    })
    password: string;

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
