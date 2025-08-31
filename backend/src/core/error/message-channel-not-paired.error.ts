import { BaseError } from './base.error';
import { MESSAGE_CHANNEL_NOT_PAIRED } from './error-codes';

export class MessageChannelNotPairedError extends BaseError {
  constructor(channelId: string) {
    super(
      MESSAGE_CHANNEL_NOT_PAIRED,
      `Message channel '${channelId}' is not paired`,
    );
  }
}
