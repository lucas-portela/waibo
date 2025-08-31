import { BaseError } from './base.error';
import { BOT_NOT_FOUND_ERROR } from './error-codes';

export class BotNotFoundError extends BaseError {
  constructor(botId: string) {
    super(BOT_NOT_FOUND_ERROR, `Bot with ID '${botId}' not found`);
  }
}
