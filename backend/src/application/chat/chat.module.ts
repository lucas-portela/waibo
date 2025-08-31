import { Module } from '@nestjs/common';
import { ChannelPairingService } from './services/channel-pairing.service';
import { MessageChannelService } from './services/message-channel.service';
import { ChatService } from './services/chat.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [MessageChannelService, ChannelPairingService, ChatService],
  exports: [MessageChannelService, ChannelPairingService, ChatService],
})
export class ChatModule {}
