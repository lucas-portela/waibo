import { Module } from '@nestjs/common';
import { ChatModule } from 'src/application/chat/chat.module';
import { WhatsappBaileysService } from './whatsapp-baileys.service';

@Module({
  imports: [ChatModule],
  providers: [WhatsappBaileysService],
})
export class WhatsappBaileysModule {}
