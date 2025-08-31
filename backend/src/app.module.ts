import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/db/prisma/prisma.module';
import { UserModule } from './http/user/user.module';
import { AuthModule } from './http/auth/auth.module';
import { BcryptModule } from './infra/crypto/bcrypt/bcrypt.module';
import { ConfigModule } from '@nestjs/config';
import { JwtTokenModule } from './infra/crypto/jwt-token/jwt-token.module';
import { appConfig } from './config';
import { jwtTokenConfig } from './infra/crypto/jwt-token/jwt-token.config';
import { RabbitMQModule } from './infra/queue/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtTokenConfig],
    }),
    PrismaModule,
    BcryptModule,
    JwtTokenModule,
    RabbitMQModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
