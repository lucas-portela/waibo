import { BaseError } from './base.error';
import { LANGUAGE_MODEL_MISCONFIGURED_ERROR } from './error-codes';

export class LanguageModelMisconfiguredError extends BaseError {
  constructor(message?: string) {
    super(
      LANGUAGE_MODEL_MISCONFIGURED_ERROR,
      message ?? 'Language model is misconfigured',
    );
  }
}
