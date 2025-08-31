import {
  BaseEntity,
  BaseSnapshot,
  EntitySnapshot,
} from 'src/domain/base.entity';

export type BotEntitySnapshot = EntitySnapshot<{
  name: string;
  prompt: string;
  userId: string;
}>;

export class BotEntity extends BaseEntity<BotEntitySnapshot> {
  declare name: string;
  declare prompt: string;
  declare userId: string;

  protected _snapshot(): Omit<BotEntitySnapshot, keyof BaseSnapshot> {
    return {
      name: this.name,
      prompt: this.prompt,
      userId: this.userId,
    };
  }

  protected _set(data: Partial<BotEntitySnapshot> = {}) {
    if (data.name) this.name = data.name.trim();
    if (data.prompt) this.prompt = data.prompt.trim();
    if (data.userId) this.userId = data.userId.trim();
  }
}
