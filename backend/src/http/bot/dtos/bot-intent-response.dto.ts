import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BotIntentResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the bot intent',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Bot ID this intent belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  botId: string;

  @ApiProperty({
    description: 'Tag for the bot intent',
    example: 'greeting',
  })
  @Expose()
  tag: string;

  @ApiProperty({
    description: 'Name of the bot intent',
    example: 'Greeting Intent',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Trigger phrase for the bot intent',
    example: 'Hello, how are you?',
  })
  @Expose()
  trigger: string;

  @ApiProperty({
    description: 'Response for the bot intent',
    example: 'Hello! I am doing great, thank you for asking.',
  })
  @Expose()
  response: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
    required: false,
  })
  @Expose()
  updatedAt?: Date;
}
