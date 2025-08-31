import { UserDto } from 'src/application/user/dtos/user.dto';
import { z } from 'zod';

export enum TokenType {
  ACCESS = 'access',
  REFRESH = 'refresh',
}

export const AccessTokensDto = z.object({
  user: UserDto,
  accessToken: z.string().nonempty(),
  refreshToken: z.string().nonempty(),
  accessTokenExpiresAt: z.coerce.date(),
  refreshTokenExpiresAt: z.coerce.date(),
});

export type AccessTokensDto = z.infer<typeof AccessTokensDto>;
