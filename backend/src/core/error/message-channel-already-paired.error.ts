import { BaseError } from './base.error';
import { MESSAGE_CHANNEL_ALREADY_PAIRED } from './error-codes';

export class MessageChannelAlreadyPairedError extends BaseError {
  constructor(channelId: string) {
    super(
      MESSAGE_CHANNEL_ALREADY_PAIRED,
      `Message channel '${channelId}' is already paired`,
    );
  }
}
