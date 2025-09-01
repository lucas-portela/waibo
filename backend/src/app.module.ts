import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/db/prisma/prisma.module';
import { UserHttpModule } from './http/user/user-http.module';
import { AuthHttpModule } from './http/auth/auth-http.module';
import { MessageChannelHttpModule } from './http/message-channel/message-channel-http.module';
import { BcryptModule } from './infra/crypto/bcrypt/bcrypt.module';
import { ConfigModule } from '@nestjs/config';
import { JwtTokenModule } from './infra/crypto/jwt-token/jwt-token.module';
import { appConfig } from './config';
import { jwtTokenConfig } from './infra/crypto/jwt-token/jwt-token.config';
import { RabbitMQModule } from './infra/queue/rabbitmq/rabbitmq.module';
import { AuthModule } from './application/auth/auth.module';
import { UserModule } from './application/user/user.module';
import { ChatModule } from './application/chat/chat.module';
import { BotModule } from './application/bot/bot.module';
import { BotHttpModule } from './http/bot/bot-http.module';
import { ChatHttpModule } from './http/chat/chat-http.module';
import { WhatsappBaileysModule } from './infra/message-channel/whatsapp-baileys/whatsapp-baileys.module';
import { rabbitMqConfig } from './infra/queue/rabbitmq/rabbitmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtTokenConfig, rabbitMqConfig],
    }),
    PrismaModule,
    BcryptModule,
    JwtTokenModule,
    RabbitMQModule,
    UserModule,
    AuthModule,
    ChatModule,
    BotModule,
    AuthHttpModule,
    UserHttpModule,
    MessageChannelHttpModule,
    BotHttpModule,
    ChatHttpModule,
    WhatsappBaileysModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
