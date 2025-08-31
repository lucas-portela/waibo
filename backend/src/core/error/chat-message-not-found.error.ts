import { BaseError } from './base.error';
import { CHAT_MESSAGE_NOT_FOUND_ERROR } from './error-codes';

export class ChatMessageNotFoundError extends BaseError {
  constructor(messageId: string) {
    super(
      CHAT_MESSAGE_NOT_FOUND_ERROR,
      `Chat message with ID '${messageId}' not found`,
    );
  }
}
