import { ApiProperty } from '@nestjs/swagger';

export class ChatResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the chat',
    example: 'chat-id-123',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the chat',
    example: 'John Doe Chat',
  })
  name: string;

  @ApiProperty({
    description: 'Contact information',
    example: '+1234567890',
  })
  contact: string;

  @ApiProperty({
    description: 'Internal identifier for the chat',
    example: 'chat_internal_123',
  })
  internalIdentifier: string;

  @ApiProperty({
    description: 'ID of the associated message channel',
    example: 'channel-id-456',
  })
  messageChannelId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-08-31T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-08-31T12:30:00Z',
    required: false,
  })
  updatedAt?: Date;
}
