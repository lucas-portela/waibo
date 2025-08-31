import { BaseError } from './base.error';
import { INTERNAL_ERROR_CODE } from './error-codes';

export class InternalError extends BaseError {
  constructor(message: string) {
    super(INTERNAL_ERROR_CODE, message);
  }
}
