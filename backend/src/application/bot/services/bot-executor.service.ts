import { Inject, Injectable, Logger } from '@nestjs/common';
import { LANGUAGE_MODEL_SERVICE } from '../tokens';
import type {
  AdvancedPrompt,
  LanguageModelService,
} from '../ports/language-model.service';
import { ChatService } from 'src/application/chat/services/chat.service';
import { BotService } from './bot.service';
import { BOT_SYSTEM_PROMPT } from '../prompts';
import { BotIntentService } from './bot-intent.service';
import { OptimizedBotAnswerDto } from '../dtos/optimized-bot-answer.dto';
import { ChatSender } from 'src/domain/chat/entities/chat-message.entity';

@Injectable()
export class BotExecutorService {
  private readonly logger = new Logger(BotExecutorService.name);

  constructor(
    private readonly botService: BotService,
    private readonly botIntentService: BotIntentService,
    @Inject(LANGUAGE_MODEL_SERVICE)
    private readonly languageModelService: LanguageModelService,
    private readonly chatService: ChatService,
  ) {}

  onModuleInit() {
    this.chatService.onInputEvent({
      channelType: '*',
      handler: async ({ data }) => {
        const bot = await this.botService.findById(data.channel.botId);
        if (!bot) {
          this.logger.warn(
            `Bot with ID ${data.channel.botId} not found in channel ${data.channel.id}.`,
          );
          return;
        }

        const intents = await this.botIntentService.findByBotId(bot.id);
        const messages = await this.chatService.findMessagesByChatId(
          data.chat.id,
        );

        const history = messages.slice(-3);

        const prompt: AdvancedPrompt = {
          system: BOT_SYSTEM_PROMPT({
            taskDescription: bot.prompt,
            memory: data.chat.botMemory || 'empty',
            intents: intents,
            history,
          }),
          user: data.message.content,
        };

        const response = await this.languageModelService.generate(prompt);

        let answer: OptimizedBotAnswerDto;
        try {
          answer = OptimizedBotAnswerDto.parse(JSON.parse(response));
        } catch (error) {
          this.logger.error('Error parsing bot response', error);
          return;
        }

        if (answer.triggered_intent) {
          const intent = intents.find((i) => i.tag === answer.triggered_intent);
          if (intent) answer.response = intent.response;
        }

        if (!answer.response) {
          this.logger.warn(
            `Bot with ID ${bot.id} failed to provide a response.`,
          );
          return;
        }

        if (answer.memory_update) {
          data.chat.botMemory = answer.memory_update;
          await this.chatService.updateChat(data.chat.id, {
            botMemory: data.chat.botMemory,
          });
        }

        await this.chatService.createMessage({
          sender: ChatSender.BOT,
          content: answer.response,
          chatInternalIdentifier: data.chat.internalIdentifier,
        });
      },
    });
  }
}
