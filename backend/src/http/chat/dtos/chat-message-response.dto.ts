import { ApiProperty } from '@nestjs/swagger';

export class ChatMessageResponseDto {
  @ApiProperty({
    description: 'Unique identifier of the message',
    example: 'message-uuid-123',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the chat this message belongs to',
    example: 'chat-uuid-456',
  })
  chatId: string;

  @ApiProperty({
    description: 'Sender of the message',
    example: 'USER',
    enum: ['USER', 'BOT', 'SYSTEM'],
  })
  sender: string;

  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, how can I help you?',
  })
  content: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-08-31T12:00:00Z',
  })
  createdAt: Date;
}
