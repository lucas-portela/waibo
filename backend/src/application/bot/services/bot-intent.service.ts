import { Inject, Injectable } from '@nestjs/common';
import {
  BOT_INTENT_REPOSITORY,
  BOT_REPOSITORY,
  LANGUAGE_MODEL_SERVICE,
} from '../tokens';
import type {
  BotIntentRepository,
  BotRepository,
} from 'src/domain/bot/repositories/bot.repository';
import { CreateBotIntentDto } from '../dtos/create-bot-intent.dto';
import { UpdateBotIntentDto } from '../dtos/update-bot-intent.dto';
import { BotIntentDto } from '../dtos/bot-intent.dto';
import { BotIntentNotFoundError } from 'src/core/error/bot-intent-not-found.error';
import { BotNotFoundError } from 'src/core/error/bot-not-found.error';
import type { LanguageModelService } from '../ports/language-model.service';
import { FailedToGenerateTagAndNameError } from 'src/core/error/failed-to-generate-tag-and-name.error';
import { GENERATE_TAG_AND_NAME_PROMPT } from '../prompts';

@Injectable()
export class BotIntentService {
  constructor(
    @Inject(BOT_INTENT_REPOSITORY)
    private readonly botIntentRepository: BotIntentRepository,
    @Inject(BOT_REPOSITORY)
    private readonly botRepository: BotRepository,
    @Inject(LANGUAGE_MODEL_SERVICE)
    private readonly languageModelService: LanguageModelService,
  ) {}

  async create(data: CreateBotIntentDto): Promise<BotIntentDto> {
    const bot = await this.botRepository.findById(data.botId);
    if (!bot) {
      throw new BotNotFoundError(data.botId);
    }

    if (!data.tag || !data.name) {
      const generated = await this.languageModelService.generateSimple(
        GENERATE_TAG_AND_NAME_PROMPT({
          trigger: data.trigger,
          response: data.response,
        }),
      );

      let nameAndTag: { tag: string; name: string } | null = null;
      try {
        nameAndTag = JSON.parse(generated);
        if (!nameAndTag || !nameAndTag.tag || !nameAndTag.name)
          throw new Error();
      } catch {
        throw new FailedToGenerateTagAndNameError();
      }

      data.name = data.name || nameAndTag.name;
      data.tag = data.tag || nameAndTag.tag;
    }

    const botIntent = await this.botIntentRepository.create({
      botId: data.botId,
      tag: data.tag,
      name: data.name,
      trigger: data.trigger,
      response: data.response,
    });

    return BotIntentDto.parse(botIntent);
  }

  async findByBotId(botId: string): Promise<BotIntentDto[]> {
    const botIntents = await this.botIntentRepository.findByBotId(botId);
    return botIntents.map((botIntent) => BotIntentDto.parse(botIntent));
  }

  async findById(id: string): Promise<BotIntentDto> {
    const botIntent = await this.botIntentRepository.findById(id);
    if (!botIntent) {
      throw new BotIntentNotFoundError(id);
    }

    return BotIntentDto.parse(botIntent);
  }

  async update(id: string, data: UpdateBotIntentDto): Promise<BotIntentDto> {
    const botIntent = await this.botIntentRepository.findById(id);
    if (!botIntent) {
      throw new BotIntentNotFoundError(id);
    }

    const updatedBotIntent = await this.botIntentRepository.update(id, {
      tag: data.tag,
      name: data.name,
      trigger: data.trigger,
      response: data.response,
    });

    return BotIntentDto.parse(updatedBotIntent);
  }

  async delete(id: string): Promise<void> {
    const botIntent = await this.botIntentRepository.findById(id);
    if (!botIntent) {
      throw new BotIntentNotFoundError(id);
    }

    await this.botIntentRepository.delete(id);
  }
}
