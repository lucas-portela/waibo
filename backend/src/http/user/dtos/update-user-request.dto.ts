import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateUserRequestDto {
  @ApiProperty({
    description: 'Username for the user',
    example: 'johndoe',
    minLength: 3,
    maxLength: 30,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username?: string;

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    minLength: 3,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Password for the user',
    example: 'securePassword123',
    minLength: 6,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password?: string;
}
