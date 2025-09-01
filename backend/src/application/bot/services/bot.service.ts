import { Inject, Injectable } from '@nestjs/common';
import { BOT_INTENT_REPOSITORY, BOT_REPOSITORY } from '../tokens';
import type {
  BotIntentRepository,
  BotRepository,
} from 'src/domain/bot/repositories/bot.repository';
import { CreateBotDto } from '../dtos/create-bot.dto';
import { UpdateBotDto } from '../dtos/update-bot.dto';
import { BotDto } from '../dtos/bot.dto';
import { BotNotFoundError } from 'src/core/error/bot-not-found.error';

@Injectable()
export class BotService {
  constructor(
    @Inject(BOT_REPOSITORY)
    private readonly botRepository: BotRepository,
    @Inject(BOT_INTENT_REPOSITORY)
    private readonly botIntentRepository: BotIntentRepository,
  ) {}

  async create(data: CreateBotDto): Promise<BotDto> {
    const bot = await this.botRepository.create({
      name: data.name,
      prompt: data.prompt,
      userId: data.userId,
    });

    return BotDto.parse(bot);
  }

  async findById(id: string): Promise<BotDto> {
    const bot = await this.botRepository.findById(id);
    if (!bot) {
      throw new BotNotFoundError(id);
    }

    return BotDto.parse(bot);
  }

  async findByUserId(userId: string): Promise<BotDto[]> {
    const bots = await this.botRepository.findByUserId(userId);
    return bots.map((bot) => BotDto.parse(bot));
  }

  async update(id: string, data: UpdateBotDto): Promise<BotDto> {
    const bot = await this.botRepository.findById(id);
    if (!bot) {
      throw new BotNotFoundError(id);
    }

    const updatedBot = await this.botRepository.update(id, {
      name: data.name,
      prompt: data.prompt,
    });

    return BotDto.parse(updatedBot);
  }

  async delete(id: string): Promise<void> {
    const bot = await this.botRepository.findById(id);
    if (!bot) {
      throw new BotNotFoundError(id);
    }

    await this.botIntentRepository.deleteByBotId(id);
    await this.botRepository.delete(id);
  }
}
