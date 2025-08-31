import { Module } from '@nestjs/common';
import { BotService } from './services/bot.service';

@Module({
  imports: [],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
