import { BaseError } from './base.error';
import { MESSAGE_CHANNEL_NOT_FOUND_ERROR } from './error-codes';

export class MessageChannelNotFoundError extends BaseError {
  constructor(channelId: string) {
    super(
      MESSAGE_CHANNEL_NOT_FOUND_ERROR,
      `Message channel with ID '${channelId}' not found`,
    );
  }
}
