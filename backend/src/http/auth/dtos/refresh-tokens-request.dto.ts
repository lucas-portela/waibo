import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokensRequestDto {
  @ApiProperty({ description: 'The refresh token' })
  @IsNotEmpty()
  refreshToken: string;
}
