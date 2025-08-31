import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserPrismaRepository } from './repositories/user-prisma-repository';
import { USER_REPOSITORY } from 'src/application/user/tokens';
import {
  CHAT_MESSAGE_REPOSITORY,
  CHAT_REPOSITORY,
  MESSAGE_CHANNEL_REPOSITORY,
} from 'src/application/chat/tokens';
import { MessageChannelPrismaRepository } from './repositories/message-channel-prisma-repository';
import { BotPrismaRepository } from './repositories/bot-prisma-repository';
import {
  BOT_INTENT_REPOSITORY,
  BOT_REPOSITORY,
} from 'src/application/bot/tokens';
import { ChatMessagePrismaRepository } from './repositories/chat-message-prisma-repository';
import { ChatPrismaRepository } from './repositories/chat-prisma-repository';
import { BotIntentPrismaRepository } from './repositories/bot-intent-prisma-repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
    {
      provide: MESSAGE_CHANNEL_REPOSITORY,
      useClass: MessageChannelPrismaRepository,
    },
    {
      provide: CHAT_MESSAGE_REPOSITORY,
      useClass: ChatMessagePrismaRepository,
    },
    {
      provide: CHAT_REPOSITORY,
      useClass: ChatPrismaRepository,
    },
    {
      provide: BOT_REPOSITORY,
      useClass: BotPrismaRepository,
    },
    {
      provide: BOT_INTENT_REPOSITORY,
      useClass: BotIntentPrismaRepository,
    },
  ],
  exports: [
    PrismaService,
    USER_REPOSITORY,
    MESSAGE_CHANNEL_REPOSITORY,
    CHAT_MESSAGE_REPOSITORY,
    CHAT_REPOSITORY,
    BOT_INTENT_REPOSITORY,
    BOT_REPOSITORY,
  ],
})
export class PrismaModule {}
