import { BaseError } from './base.error';
import { CHAT_NOT_FOUND_ERROR } from './error-codes';

export class ChatNotFoundError extends BaseError {
  constructor(chatId?: string) {
    super(
      CHAT_NOT_FOUND_ERROR,
      chatId ? `Chat with ID '${chatId}' not found` : 'Chat not found',
    );
  }
}
