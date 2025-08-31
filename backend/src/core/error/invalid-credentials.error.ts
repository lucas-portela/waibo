import { BaseError } from './base.error';
import { INVALID_CREDENTIALS_ERROR_CODE } from './error-codes';

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super(INVALID_CREDENTIALS_ERROR_CODE, 'Invalid credentials');
  }
}
