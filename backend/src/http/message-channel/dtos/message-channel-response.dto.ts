import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  Length,
  MinLength,
  IsOptional,
  IsDate,
  IsNotEmpty,
} from 'class-validator';

export class MessageChannelResponseDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    type: String,
    minLength: 1,
    maxLength: 100,
    example: 'Support Channel',
    description: 'The name of the message channel.',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    type: String,
    minLength: 1,
    maxLength: 100,
    example: '+556195734461',
    description: 'The contact information associated with the channel.',
  })
  @IsString()
  @Length(1, 100)
  contact: string;

  @ApiProperty({
    type: String,
    minLength: 1,
    maxLength: 50,
    example: 'whatsapp',
    description: 'The type of the message channel (e.g., whatsapp, discord).',
  })
  @IsString()
  @Length(1, 50)
  type: string;

  @ApiProperty({
    type: String,
    example: 'active',
    description: 'The status of the message channel.',
  })
  @IsString()
  status: string;

  @ApiProperty({
    type: String,
    minLength: 1,
    example: 'user-123',
    description: 'The ID of the user who owns the channel.',
  })
  @IsString()
  @MinLength(1)
  userId: string;

  @ApiProperty({
    type: String,
    minLength: 1,
    example: 'bot-456',
    description: 'The ID of the bot associated with the channel.',
  })
  @IsString()
  @MinLength(1)
  botId: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'session-789',
    description: 'The session ID if available, otherwise null.',
  })
  @IsOptional()
  @IsString()
  sessionId: string | null;

  @ApiProperty({
    type: Date,
    example: '2024-06-01T12:00:00.000Z',
    description: 'The date and time when the channel was created.',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    type: Date,
    required: false,
    example: '2024-06-02T15:30:00.000Z',
    description: 'The date and time when the channel was last updated.',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  updatedAt?: Date;
}
