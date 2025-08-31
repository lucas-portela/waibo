import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateMessageChannelRequestDto {
  @ApiProperty({
    description: 'Name of the message channel',
    example: 'Customer Support',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Contact information for the channel',
    example: '+1234567890',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  contact: string;

  @ApiProperty({
    description: 'Type of the message channel',
    example: 'whatsapp',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  type: string;

  @ApiProperty({
    description: 'Bot ID associated with the channel',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @MinLength(1)
  botId: string;
}
