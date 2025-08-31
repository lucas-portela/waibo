import {
  BaseEntity,
  BaseSnapshot,
  EntitySnapshot,
} from 'src/domain/base.entity';

export type BotIntentEntitySnapshot = EntitySnapshot<{
  botId: string;
  tag: string;
  name: string;
  trigger: string;
  response: string;
}>;

export class BotIntentEntity extends BaseEntity<BotIntentEntitySnapshot> {
  declare botId: string;
  declare tag: string;
  declare name: string;
  declare trigger: string;
  declare response: string;

  protected _snapshot(): Omit<BotIntentEntitySnapshot, keyof BaseSnapshot> {
    return {
      botId: this.botId,
      tag: this.tag,
      name: this.name,
      trigger: this.trigger,
      response: this.response,
    };
  }

  protected _set(data: Partial<BotIntentEntitySnapshot> = {}) {
    if (data.botId) this.botId = data.botId.trim();
    if (data.tag) this.tag = data.tag.trim();
    if (data.name) this.name = data.name.trim();
    if (data.trigger) this.trigger = data.trigger.trim();
    if (data.response) this.response = data.response.trim();
  }
}
