import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { UserResponseDto } from 'src/http/user/dtos/user-response.dto';

export class AccessTokensResponseDto {
  @ApiProperty({ type: () => UserResponseDto })
  @ValidateNested()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({ type: String, description: 'Access token' })
  accessToken: string;

  @ApiProperty({ type: String, description: 'Refresh token' })
  refreshToken: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @Type(() => Date)
  accessTokenExpiresAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @Type(() => Date)
  refreshTokenExpiresAt: Date;
}
