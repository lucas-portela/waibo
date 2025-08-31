import { Module } from '@nestjs/common';
import { MessageChannelController } from './message-channel.controller';
import { MessageChannelService } from 'src/application/chat/services/message-channel.service';
import { AuthModule } from '../auth/auth.module';
import { MESSAGE_CHANNEL_SERVICE } from 'src/application/chat/tokens';

@Module({
  imports: [AuthModule],
  controllers: [MessageChannelController],
  providers: [
    {
      provide: MESSAGE_CHANNEL_SERVICE,
      useClass: MessageChannelService,
    },
  ],
  exports: [MESSAGE_CHANNEL_SERVICE],
})
export class MessageChannelModule {}
