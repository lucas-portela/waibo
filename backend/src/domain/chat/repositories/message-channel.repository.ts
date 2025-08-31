import { BaseSnapshot } from 'src/domain/base.entity';
import {
  MessageChannelEntity,
  MessageChannelEntitySnapshot,
} from '../entities/message-channel.entity';

export type MessageChannelUpdate = Partial<
  Omit<MessageChannelEntitySnapshot, keyof BaseSnapshot>
>;
export type MessageChannelCreate = Omit<
  MessageChannelEntitySnapshot,
  keyof BaseSnapshot
>;
export type MessageChannelFindBySessionIdAndType = Required<
  Pick<MessageChannelEntitySnapshot, 'sessionId' | 'type'>
>;

export interface MessageChannelRepository {
  findById(id: string): Promise<MessageChannelEntity | null>;
  findBySessionIdAndType(
    params: MessageChannelFindBySessionIdAndType,
  ): Promise<MessageChannelEntity | null>;
  findByUserId(userId: string): Promise<MessageChannelEntity[]>;
  findByBotId(botId: string): Promise<MessageChannelEntity[]>;
  findByName(name: string): Promise<MessageChannelEntity | null>;
  create(messageChannel: MessageChannelCreate): Promise<MessageChannelEntity>;
  update(
    id: string,
    messageChannel: MessageChannelUpdate,
  ): Promise<MessageChannelEntity>;
  delete(id: string): Promise<void>;
}
