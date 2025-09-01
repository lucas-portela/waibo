import { BaseError } from './base.error';
import { LANGUAGE_MODEL_UNEXPECTED_ERROR } from './error-codes';

export class LanguageModelUnexpectedError extends BaseError {
  constructor(message?: string) {
    super(
      LANGUAGE_MODEL_UNEXPECTED_ERROR,
      message ?? 'An unexpected language model error occurred',
    );
  }
}
