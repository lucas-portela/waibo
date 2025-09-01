import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

/*
export const UpdateMessageChannelDetailsDto = z.object({
  name: z.string().min(1).max(100).optional(),
  contact: z.string().min(1).max(100).optional(),
  type: z.string().min(1).max(50).optional(),
});
*/
export class UpdateMessageChannelRequestDto {
  @ApiProperty({
    description: 'Name of the message channel',
    example: 'Customer Support',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Contact information for the channel',
    example: '+1234567890',
    minLength: 1,
    maxLength: 100,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  contact?: string;

  @ApiProperty({
    description: 'Type of the message channel',
    example: 'whatsapp',
    minLength: 1,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  type?: string;
}
