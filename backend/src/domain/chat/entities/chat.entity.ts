import {
  BaseEntity,
  BaseSnapshot,
  EntitySnapshot,
} from 'src/domain/base.entity';

export type ChatEntitySnapshot = EntitySnapshot<{
  messageChannelId: string;
  name: string;
  contact: string;
}>;

export class ChatEntity extends BaseEntity<ChatEntitySnapshot> {
  declare messageChannelId: string;
  declare name: string;
  declare contact: string;

  protected _snapshot(): Omit<ChatEntitySnapshot, keyof BaseSnapshot> {
    return {
      messageChannelId: this.messageChannelId,
      name: this.name,
      contact: this.contact,
    };
  }

  protected _set(data: Partial<ChatEntitySnapshot> = {}) {
    if (data.messageChannelId)
      this.messageChannelId = data.messageChannelId.trim();
    if (data.name) this.name = data.name.trim();
    if (data.contact) this.contact = data.contact.trim();
  }
}
