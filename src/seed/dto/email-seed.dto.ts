import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserSeed {

  @IsString()
  @ApiProperty({
    example: 'admin_USER0121354',
    description: 'User "username" (unique)',
    nullable: false,
    minLength: 6
  })
  username: string;
  @ApiProperty({
    example: '123456',
    description: 'User "password"',
    nullable: false,
    minLength: 6
})
  @IsNotEmpty()
  @IsString()
  password: string;
}
