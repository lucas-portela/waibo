import { BaseSnapshot } from 'src/domain/base.entity';
import { ChatEntity, ChatEntitySnapshot } from '../entities/chat.entity';

export type ChatUpdate = Partial<Omit<ChatEntitySnapshot, keyof BaseSnapshot>>;
export type ChatCreate = Omit<ChatEntitySnapshot, keyof BaseSnapshot>;

export interface ChatRepository {
  findById(id: string): Promise<ChatEntity | null>;
  findByMessageChannelId(messageChannelId: string): Promise<ChatEntity[]>;
  findByContact(contact: string): Promise<ChatEntity[]>;
  create(chat: ChatCreate): Promise<ChatEntity>;
  update(id: string, chat: ChatUpdate): Promise<ChatEntity>;
  delete(id: string): Promise<void>;
}
