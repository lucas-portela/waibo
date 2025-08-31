import { AccessTokenService } from 'src/application/auth/ports/access-token.service';
import {
  AccessTokensDto,
  TokenType,
} from 'src/application/auth/dtos/access-tokens.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JWT_TOKEN_CONFIG } from './jwt-token.config';
import { UserDto } from 'src/application/user/dtos/user.dto';
import { InvalidConfigurationError } from 'src/core/error/invalid-configuration-error';
import { InternalError } from 'src/core/error/internal-error';

export type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
  type: TokenType;
};

@Injectable()
export class JwtAccessTokenService implements AccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async generate(user: UserDto): Promise<AccessTokensDto> {
    const { token: accessToken, expiresAt: accessTokenExpiresAt } =
      await this._encode(user.id, TokenType.ACCESS, this._getExpiresIn());

    const { token: refreshToken, expiresAt: refreshTokenExpiresAt } =
      await this._encode(
        user.id,
        TokenType.REFRESH,
        this._getRefreshTokenExpiresIn(),
      );

    return AccessTokensDto.parse({
      user,
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    });
  }

  async validate(
    accessOrRefreshToken: string,
    type: TokenType,
  ): Promise<string | null> {
    const decoded = await this._decode(accessOrRefreshToken);
    if (!decoded || !decoded.sub || decoded.type !== type) return null;
    return decoded.sub;
  }

  // Helpers
  private _getSecret() {
    const value = this.config.get<string>(JWT_TOKEN_CONFIG.SECRET);
    if (!value) throw new InvalidConfigurationError(JWT_TOKEN_CONFIG.SECRET);
    return value;
  }

  private _getExpiresIn() {
    const value = this.config.get<string>(JWT_TOKEN_CONFIG.EXPIRES_IN);
    if (!value)
      throw new InvalidConfigurationError(JWT_TOKEN_CONFIG.EXPIRES_IN);
    return value;
  }

  private _getRefreshTokenExpiresIn() {
    const value = this.config.get<string>(JWT_TOKEN_CONFIG.REFRESH_EXPIRES_IN);
    if (!value)
      throw new InvalidConfigurationError(JWT_TOKEN_CONFIG.REFRESH_EXPIRES_IN);
    return value;
  }

  private async _encode(id: string, type: TokenType, expiresIn: string) {
    const secret = this._getSecret();
    const token = await this.jwtService.signAsync(
      { sub: id, type },
      { secret, expiresIn },
    );

    const decoded = await this._decode(token);
    if (!decoded)
      throw new InternalError(
        'Failed to decode generated token in JwtAccessTokenService',
      );

    return { token, expiresAt: new Date(decoded.exp * 1000) };
  }

  private async _decode(token: string): Promise<JwtPayload | null> {
    const secret = this._getSecret();
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret,
      });
      return payload;
    } catch {
      return null;
    }
  }
}
