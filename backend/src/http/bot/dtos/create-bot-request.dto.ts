import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MinLength, MaxLength, IsArray } from 'class-validator';
import { CreateBotIntentRequestDto } from './create-bot-intent-request.dto';

export class CreateBotRequestDto {
  @ApiProperty({
    description: 'Name of the bot',
    example: 'Customer Support Bot',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Prompt for the bot',
    example: 'You are a helpful customer support assistant...',
    minLength: 1,
    maxLength: 2000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  prompt: string;

  @ApiProperty({
    description: 'List of intents for the bot',
    type: [CreateBotIntentRequestDto],
    example: [
      { trigger: 'Hello', response: 'Hi there! How can I assist you today?' },
      {
        trigger: 'What is your return policy?',
        response: 'Our return policy is...',
      },
    ],
  })
  @IsArray()
  @Type(() => CreateBotIntentRequestDto)
  intents: CreateBotIntentRequestDto[];
}
