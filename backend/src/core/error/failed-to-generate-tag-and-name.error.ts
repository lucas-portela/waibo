import { BaseError } from './base.error';
import { FAILED_TO_GENERATE_NAME_AND_TAG_ERROR } from './error-codes';

export class FailedToGenerateTagAndNameError extends BaseError {
  constructor() {
    super(
      FAILED_TO_GENERATE_NAME_AND_TAG_ERROR,
      'Failed to generate tag and name for the bot intent',
    );
  }
}
