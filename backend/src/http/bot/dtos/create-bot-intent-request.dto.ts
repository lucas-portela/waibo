import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateBotIntentRequestDto {
  @ApiProperty({
    description: 'Tag for the bot intent',
    example: 'greeting',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  tag: string;

  @ApiProperty({
    description: 'Name of the bot intent',
    example: 'Greeting Intent',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Trigger phrase for the bot intent',
    example: 'Hello, how are you?',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  trigger: string;

  @ApiProperty({
    description: 'Response for the bot intent',
    example: 'Hello! I am doing great, thank you for asking.',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  response: string;
}
