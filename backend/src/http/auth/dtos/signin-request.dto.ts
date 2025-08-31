import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SignInRequestDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The user username' })
  username: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The user password' })
  password: string;
}
