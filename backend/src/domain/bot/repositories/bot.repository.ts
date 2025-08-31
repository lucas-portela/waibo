import { BaseSnapshot } from 'src/domain/base.entity';
import { BotEntity, BotEntitySnapshot } from '../entities/bot.entity';
import {
  BotIntentEntity,
  BotIntentEntitySnapshot,
} from '../entities/bot-intent.entity';

export type BotUpdate = Partial<Omit<BotEntitySnapshot, keyof BaseSnapshot>>;
export type BotCreate = Omit<BotEntitySnapshot, keyof BaseSnapshot>;

export type BotIntentUpdate = Partial<
  Omit<BotIntentEntitySnapshot, keyof BaseSnapshot>
>;
export type BotIntentCreate = Omit<BotIntentEntitySnapshot, keyof BaseSnapshot>;

export interface BotRepository {
  findById(id: string): Promise<BotEntity | null>;
  findByUserId(userId: string): Promise<BotEntity[]>;
  create(bot: BotCreate): Promise<BotEntity>;
  update(id: string, bot: BotUpdate): Promise<BotEntity>;
  delete(id: string): Promise<void>;
}

export interface BotIntentRepository {
  findById(id: string): Promise<BotIntentEntity | null>;
  findByBotId(botId: string): Promise<BotIntentEntity[]>;
  findByTag(tag: string, botId: string): Promise<BotIntentEntity | null>;
  create(botIntent: BotIntentCreate): Promise<BotIntentEntity>;
  update(id: string, botIntent: BotIntentUpdate): Promise<BotIntentEntity>;
  delete(id: string): Promise<void>;
}
