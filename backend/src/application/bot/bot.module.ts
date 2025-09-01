import { Module } from '@nestjs/common';
import { BotService } from './services/bot.service';
import { BotExecutorService } from './services/bot-executor.service';
import { BotIntentService } from './services/bot-intent.service';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [ChatModule],
  providers: [BotService, BotExecutorService, BotIntentService],
  exports: [BotService, BotIntentService],
})
export class BotModule {}
