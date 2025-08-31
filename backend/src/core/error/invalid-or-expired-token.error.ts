import { BaseError } from './base.error';
import { INVALID_OR_EXPIRED_TOKEN_ERROR_CODE } from './error-codes';

export class InvalidOrExpiredTokenError extends BaseError {
  constructor() {
    super(INVALID_OR_EXPIRED_TOKEN_ERROR_CODE, 'Invalid or expired token');
  }
}
