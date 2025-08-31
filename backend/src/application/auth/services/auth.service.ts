import { forwardRef, Inject, Injectable } from '@nestjs/common';
import type { PasswordHasher } from 'src/application/auth/ports/password-hasher';
import type { AccessTokenService } from '../ports/access-token.service';
import { InvalidCredentialsError } from 'src/core/error/invalid-credentials.error';
import { ACCESS_TOKEN_SERVICE, PASSWORD_HASHER } from '../tokens';
import { UserService } from 'src/application/user/services/user.service';
import { AccessTokensDto, TokenType } from '../dtos/access-tokens.dto';
import { InvalidOrExpiredTokenError } from 'src/core/error/invalid-or-expired-token.error';
import { UserNotFoundError } from 'src/core/error/user-not-found.error';
import { ValidateUserCredentialsDto } from '../dtos/validate-user-credentials.dto';
import { ZodError } from 'zod';
import { InvalidDtoFieldsError } from 'src/core/error/invalid-dto-fields.error';
import { UserDto } from 'src/application/user/dtos/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(PASSWORD_HASHER) private passwordHasher: PasswordHasher,
    @Inject(ACCESS_TOKEN_SERVICE)
    private accessTokenService: AccessTokenService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return this.passwordHasher.hash(password);
  }

  async validateCredentials(
    data: ValidateUserCredentialsDto,
  ): Promise<AccessTokensDto> {
    try {
      data = ValidateUserCredentialsDto.parse(data);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new InvalidDtoFieldsError(err.issues);
      }
      throw err;
    }

    const user = await this.userService.findByUsername(data.username);
    if (!user) throw new InvalidCredentialsError();

    const passwordMatches = await this.passwordHasher.compare(
      data.password,
      user.password,
    );
    if (!passwordMatches) throw new InvalidCredentialsError();

    return await this.accessTokenService.generate(user);
  }

  async validateToken(accessToken: string): Promise<UserDto> {
    const userId = await this.accessTokenService.validate(
      accessToken,
      TokenType.ACCESS,
    );
    if (!userId) {
      throw new InvalidOrExpiredTokenError();
    }

    const user = await this.userService.findById(userId);
    if (!user) throw new UserNotFoundError(userId);

    return user;
  }

  async refreshToken(refreshToken: string): Promise<AccessTokensDto> {
    const userId = await this.accessTokenService.validate(
      refreshToken,
      TokenType.REFRESH,
    );

    if (!userId) {
      throw new InvalidOrExpiredTokenError();
    }

    const user = await this.userService.findById(userId);
    if (!user) throw new UserNotFoundError(userId);

    return await this.accessTokenService.generate(user);
  }
}
