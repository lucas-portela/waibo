import {
  BotCreate,
  BotRepository,
  BotUpdate,
} from 'src/domain/bot/repositories/bot.repository';
import { PrismaService } from '../prisma.service';
import { BotEntity } from 'src/domain/bot/entities/bot.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BotPrismaRepository implements BotRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<BotEntity | null> {
    const bot = await this.prisma.bot.findUnique({ where: { id } });
    return bot ? new BotEntity(bot) : null;
  }

  async findByUserId(userId: string): Promise<BotEntity[]> {
    const bots = await this.prisma.bot.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return bots.map((bot) => new BotEntity(bot));
  }

  async create(data: BotCreate): Promise<BotEntity> {
    const created = await this.prisma.bot.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
    return new BotEntity(created);
  }

  async update(id: string, data: BotUpdate): Promise<BotEntity> {
    const updated = await this.prisma.bot.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
    return new BotEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.bot.delete({ where: { id } });
  }
}
