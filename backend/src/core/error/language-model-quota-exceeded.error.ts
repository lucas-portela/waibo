import { BaseError } from './base.error';
import { LANGUAGE_MODEL_QUOTA_EXCEEDED_ERROR } from './error-codes';

export class LanguageModelQuotaExceededError extends BaseError {
  constructor(message?: string) {
    super(
      LANGUAGE_MODEL_QUOTA_EXCEEDED_ERROR,
      message ?? 'Language model quota has been exceeded',
    );
  }
}
