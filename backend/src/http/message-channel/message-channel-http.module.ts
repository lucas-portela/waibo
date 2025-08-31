import { Module } from '@nestjs/common';
import { MessageChannelController } from './message-channel.controller';
import { ChatModule } from 'src/application/chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [MessageChannelController],
  providers: [],
  exports: [],
})
export class MessageChannelHttpModule {}
