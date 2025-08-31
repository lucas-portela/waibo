import { BaseError } from './base.error';
import { CHAT_NOT_FOUND_ERROR } from './error-codes';

export class ChatNotFoundError extends BaseError {
  constructor(chatId: string) {
    super(CHAT_NOT_FOUND_ERROR, `Chat with ID '${chatId}' not found`);
  }
}
