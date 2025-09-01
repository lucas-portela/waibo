import { BaseError } from './base.error';
import { LANGUAGE_MODEL_SERVER_ERROR } from './error-codes';

export class LanguageModelServerError extends BaseError {
  constructor(message?: string) {
    super(
      LANGUAGE_MODEL_SERVER_ERROR,
      message ?? 'Language model server error occurred',
    );
  }
}
