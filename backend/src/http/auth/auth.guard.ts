import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/application/auth/services/auth.service';
import { MissingAccessTokenError } from 'src/core/error/missing-access-token-error';
import {
  IS_ADMIN_ONLY_ENDPOINT_KEY,
  IS_PUBLIC_ENDPOINT_KEY,
  IS_USER_ONLY_ENDPOINT_KEY,
} from './auth.decorators';
import { Reflector } from '@nestjs/core';
import { AdminOnlyEndpointError } from 'src/core/error/admin-only-endpoint-error';
import { UserRole } from 'src/domain/user/entities/user.entity';
import { UserOnlyEndpointError } from 'src/core/error/user-only-endpoint-error';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ENDPOINT_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new MissingAccessTokenError();
      }
      const user = await this.authService.validateToken(token);
      const isAdmin = this.reflector.getAllAndOverride<boolean>(
        IS_ADMIN_ONLY_ENDPOINT_KEY,
        [context.getHandler(), context.getClass()],
      );
      const isUser = this.reflector.getAllAndOverride<boolean>(
        IS_USER_ONLY_ENDPOINT_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (isAdmin && user.role !== UserRole.ADMIN) {
        throw new AdminOnlyEndpointError();
      }

      if (isUser && user.role !== UserRole.USER) {
        throw new UserOnlyEndpointError();
      }

      request['user'] = user;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
