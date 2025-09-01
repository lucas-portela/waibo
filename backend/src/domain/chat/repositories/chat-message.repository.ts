import { BaseSnapshot } from 'src/domain/base.entity';
import {
  ChatMessageEntity,
  ChatMessageEntitySnapshot,
} from '../entities/chat-message.entity';

export type ChatMessageUpdate = Partial<
  Omit<ChatMessageEntitySnapshot, keyof BaseSnapshot>
>;
export type ChatMessageCreate = Omit<
  ChatMessageEntitySnapshot,
  keyof BaseSnapshot
>;

export interface ChatMessageRepository {
  findById(id: string): Promise<ChatMessageEntity | null>;
  findByChatId(chatId: string): Promise<ChatMessageEntity[]>;
  create(chatMessage: ChatMessageCreate): Promise<ChatMessageEntity>;
  update(
    id: string,
    chatMessage: ChatMessageUpdate,
  ): Promise<ChatMessageEntity>;
  delete(id: string): Promise<void>;
  deleteByChatId(chatId: string): Promise<void>;
}
