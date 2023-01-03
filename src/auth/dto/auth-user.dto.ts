import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthUserDto {

    @ApiProperty({
        description: 'User "username" (unique)',
        nullable: false,
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        description: 'User "password"',
        nullable: false,
        minLength: 6
    })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

}
