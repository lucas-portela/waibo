import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class UpdateBotRequestDto {
  @ApiProperty({
    description: 'Name of the bot',
    example: 'Customer Support Bot',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Prompt for the bot',
    example: 'You are a helpful customer support assistant...',
    minLength: 1,
    maxLength: 2000,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  prompt?: string;
}
