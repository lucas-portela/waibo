import { BaseError } from './base.error';
import { MESSAGE_CHANNEL_TYPE_NOT_AVAILABLE } from './error-codes';

export class MessageChannelTypeNotAvailableError extends BaseError {
  constructor(type: string) {
    super(
      MESSAGE_CHANNEL_TYPE_NOT_AVAILABLE,
      `Message channel type ${type} is not available.`,
    );
  }
}
