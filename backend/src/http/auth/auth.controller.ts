import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/application/auth/services/auth.service';
import { Public } from './auth.decorators';
import { SignInRequestDto } from './dtos/signin-request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokensResponseDto } from './dtos/access-tokens-response.dto';
import { InvalidCredentialsError } from 'src/core/error/invalid-credentials.error';
import { RefreshTokensRequestDto } from './dtos/refresh-tokens-request.dto';
import { InvalidOrExpiredTokenError } from 'src/core/error/invalid-or-expired-token.error';
import { UserNotFoundError } from 'src/core/error/user-not-found.error';
import { ValidateUserCredentialsDto } from 'src/application/auth/dtos/validate-user-credentials.dto';
import { plainToInstance } from 'class-transformer';
import { InvalidDtoFieldsError } from 'src/core/error/invalid-dto-fields.error';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generate access and refresh tokens from user credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful sign in',
    type: AccessTokensResponseDto,
  })
  async signIn(
    @Body() body: SignInRequestDto,
  ): Promise<AccessTokensResponseDto> {
    try {
      const access = await this.authService.validateCredentials(
        ValidateUserCredentialsDto.parse(body),
      );
      return plainToInstance(AccessTokensResponseDto, access);
    } catch (err) {
      if (err instanceof InvalidCredentialsError)
        throw new UnauthorizedException(err);
      else throw err;
    }
  }

  @Public()
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Generates new access tokens using the refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful token refresh',
    type: AccessTokensResponseDto,
  })
  async refreshTokens(
    @Body() body: RefreshTokensRequestDto,
  ): Promise<AccessTokensResponseDto> {
    try {
      const access = await this.authService.refreshToken(body.refreshToken);
      return plainToInstance(AccessTokensResponseDto, access);
    } catch (err) {
      if (
        err instanceof InvalidOrExpiredTokenError ||
        err instanceof UserNotFoundError
      )
        throw new UnauthorizedException(err);
      else if (err instanceof InvalidDtoFieldsError)
        throw new BadRequestException(err);
      else throw err;
    }
  }
}
