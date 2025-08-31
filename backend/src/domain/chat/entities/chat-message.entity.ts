import {
  BaseEntity,
  BaseSnapshot,
  EntitySnapshot,
} from 'src/domain/base.entity';

export enum ChatSender {
  USER = 'USER',
  BOT = 'BOT',
  RECIPIENT = 'RECIPIENT',
}

export type ChatMessageEntitySnapshot = EntitySnapshot<{
  chatId: string;
  sender: ChatSender | keyof typeof ChatSender;
  content: string;
}>;

export class ChatMessageEntity extends BaseEntity<ChatMessageEntitySnapshot> {
  declare chatId: string;
  declare sender: ChatSender;
  declare content: string;

  protected _snapshot(): Omit<ChatMessageEntitySnapshot, keyof BaseSnapshot> {
    return {
      chatId: this.chatId,
      sender: this.sender,
      content: this.content,
    };
  }

  protected _set(data: Partial<ChatMessageEntitySnapshot> = {}) {
    if (data.chatId) this.chatId = data.chatId.trim();
    if (data.sender) this.sender = ChatSender[data.sender] || ChatSender.USER;
    if (data.content) this.content = data.content.trim();
  }
}
