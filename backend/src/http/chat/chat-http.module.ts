import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatModule } from 'src/application/chat/chat.module';

@Module({
  imports: [ChatModule],
  controllers: [ChatController],
  providers: [],
  exports: [],
})
export class ChatHttpModule {}
