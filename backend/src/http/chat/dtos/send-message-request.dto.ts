import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SendMessageRequestDto {
  @ApiProperty({
    description: 'Internal identifier of the chat',
    example: 'chat_123456',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  chatInternalIdentifier: string;

  @ApiProperty({
    description: 'Content of the message',
    example: 'Hello, how can I help you?',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  content: string;
}
