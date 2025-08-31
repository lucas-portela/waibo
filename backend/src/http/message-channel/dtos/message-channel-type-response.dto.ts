import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class MessageChannelTypeDto {
  /**
   * Unique identifier for the message channel type
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @ApiProperty({
    description: 'Unique identifier for the message channel type',
    example: 'whatsapp',
  })
  @IsString()
  @Expose()
  id: string;

  /**
   * Name of the message channel type
   * @example "SMS"
   */
  @ApiProperty({
    description: 'Name of the message channel type',
    example: 'WhatsApp',
  })
  @IsString()
  @Length(1, 50)
  @Expose()
  name: string;
}
