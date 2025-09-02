import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UserRole } from 'src/domain/user/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({ type: String, example: 'johndoe' })
  username: string;

  @ApiProperty({ type: String, example: 'John Doe' })
  name: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ type: Date, example: '2024-06-01T12:34:56.789Z' })
  createdAt: Date;

  @ApiProperty({ type: Date, example: '2024-06-01T12:34:56.789Z' })
  updatedAt: Date;

  @Exclude()
  password?: string;
}
