import {
  BaseEntity,
  BaseSnapshot,
  EntitySnapshot,
} from 'src/domain/base.entity';

export enum MessageChannelStatus {
  CONNECTED = 'CONNECTED',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  DISCONNECTED = 'DISCONNECTED',
}

export type MessageChannelEntitySnapshot = EntitySnapshot<{
  name: string;
  contact: string;
  type: string;
  status: MessageChannelStatus | keyof typeof MessageChannelStatus;
  userId: string;
  botId: string;
  sessionId?: string | null;
}>;

export class MessageChannelEntity extends BaseEntity<MessageChannelEntitySnapshot> {
  declare name: string;
  declare contact: string;
  declare type: string;
  declare status: MessageChannelStatus;
  declare userId: string;
  declare botId: string;
  declare sessionId?: string | null;

  protected _snapshot(): Omit<
    MessageChannelEntitySnapshot,
    keyof BaseSnapshot
  > {
    return {
      name: this.name,
      contact: this.contact,
      type: this.type,
      status: this.status,
      userId: this.userId,
      botId: this.botId,
      sessionId: this.sessionId,
    };
  }

  protected _set(data: Partial<MessageChannelEntitySnapshot> = {}) {
    if (data.name) this.name = data.name.trim();
    if (data.contact) this.contact = data.contact.trim();
    if (data.type) this.type = data.type.trim();
    if (data.status)
      this.status =
        MessageChannelStatus[data.status] || MessageChannelStatus.DISCONNECTED;
    if (data.userId) this.userId = data.userId.trim();
    if (data.botId) this.botId = data.botId.trim();
    if (data.sessionId !== undefined)
      this.sessionId = data.sessionId?.trim() || null;
  }
}
