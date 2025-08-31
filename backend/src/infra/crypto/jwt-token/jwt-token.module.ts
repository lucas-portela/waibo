import { Global, Module } from '@nestjs/common';
import { ACCESS_TOKEN_SERVICE } from 'src/application/auth/tokens';
import { JwtAccessTokenService } from './jwt-access-token-service';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [JwtModule],
  providers: [
    {
      provide: ACCESS_TOKEN_SERVICE,
      useClass: JwtAccessTokenService,
    },
  ],
  exports: [ACCESS_TOKEN_SERVICE],
})
export class JwtTokenModule {}
