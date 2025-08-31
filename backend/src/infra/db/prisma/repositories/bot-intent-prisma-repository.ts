import {
  BotIntentCreate,
  BotIntentRepository,
  BotIntentUpdate,
} from 'src/domain/bot/repositories/bot.repository';
import { PrismaService } from '../prisma.service';
import { BotIntentEntity } from 'src/domain/bot/entities/bot-intent.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BotIntentPrismaRepository implements BotIntentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<BotIntentEntity | null> {
    const botIntent = await this.prisma.botIntent.findUnique({ where: { id } });
    return botIntent ? new BotIntentEntity(botIntent) : null;
  }

  async findByBotId(botId: string): Promise<BotIntentEntity[]> {
    const botIntents = await this.prisma.botIntent.findMany({
      where: { botId },
    });
    return botIntents.map((botIntent) => new BotIntentEntity(botIntent));
  }

  async findByTag(tag: string, botId: string): Promise<BotIntentEntity | null> {
    const botIntent = await this.prisma.botIntent.findFirst({
      where: { tag, botId },
    });
    return botIntent ? new BotIntentEntity(botIntent) : null;
  }

  async create(data: BotIntentCreate): Promise<BotIntentEntity> {
    const created = await this.prisma.botIntent.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
    return new BotIntentEntity(created);
  }

  async update(id: string, data: BotIntentUpdate): Promise<BotIntentEntity> {
    const updated = await this.prisma.botIntent.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
    return new BotIntentEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.botIntent.delete({ where: { id } });
  }
}
