import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotModule } from 'src/application/bot/bot.module';

@Module({
  imports: [BotModule],
  controllers: [BotController],
  providers: [],
  exports: [],
})
export class BotHttpModule {}
