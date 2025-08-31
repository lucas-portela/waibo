import { BaseError } from './base.error';
import { BOT_INTENT_NOT_FOUND_ERROR } from './error-codes';

export class BotIntentNotFoundError extends BaseError {
  constructor(intentId: string) {
    super(
      BOT_INTENT_NOT_FOUND_ERROR,
      `Bot intent with ID '${intentId}' not found`,
    );
  }
}
