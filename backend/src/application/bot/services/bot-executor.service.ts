import { Inject, Injectable } from '@nestjs/common';
import { LANGUAGE_MODEL_SERVICE } from '../tokens';
import type { LanguageModelService } from '../ports/language-model.service';
import { ChatService } from 'src/application/chat/services/chat.service';
import { BotService } from './bot.service';

@Injectable()
export class BotExecutorService {
  constructor(
    private readonly botService: BotService,
    @Inject(LANGUAGE_MODEL_SERVICE)
    private readonly languageModelService: LanguageModelService,
    private readonly chatService: ChatService,
  ) {}

  onModuleInit() {
    this.chatService.onInputEvent({
      channelType: '*',
      handler: async ({ data }) => {
        console.log(
          `Received message in chat ${data.chat.id}: ${data.message.content}`,
        );
      },
    });
  }
}
