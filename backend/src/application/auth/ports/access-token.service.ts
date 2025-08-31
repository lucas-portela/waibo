import { AccessTokensDto, TokenType } from '../dtos/access-tokens.dto';
import { UserDto } from 'src/application/user/dtos/user.dto';

export interface AccessTokenService {
  generate(user: UserDto): Promise<AccessTokensDto>;
  validate(
    accessOrRefreshToken: string,
    type: TokenType,
  ): Promise<string | null>; // returns userId if valid
}
