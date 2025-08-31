import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String, example: 'johndoe' })
  username: string;

  @ApiProperty({ type: String, example: 'John Doe' })
  name: string;

  @ApiProperty({ type: Date, example: '2024-06-01T12:34:56.789Z' })
  createdAt: Date;

  @ApiProperty({ type: Date, example: '2024-06-01T12:34:56.789Z' })
  updatedAt: Date;

  @Exclude()
  password?: string;
}
