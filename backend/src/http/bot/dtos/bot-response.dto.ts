import { ApiProperty } from '@nestjs/swagger';

export class BotResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the bot',
    example: 'bot-id-123',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the bot',
    example: 'Customer Support Bot',
  })
  name: string;

  @ApiProperty({
    description: 'Prompt for the bot',
    example: 'You are a helpful customer support assistant...',
  })
  prompt: string;

  @ApiProperty({
    description: 'ID of the user who owns the bot',
    example: 'user-id-456',
  })
  userId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-08-31T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-08-31T12:30:00Z',
  })
  updatedAt: Date;
}
