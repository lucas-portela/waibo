import { BaseError } from './base.error';
import { DUPLICATED_USERNAME_ERROR_CODE } from './error-codes';

export class DuplicatedUsernameError extends BaseError {
  constructor(message: string) {
    super(DUPLICATED_USERNAME_ERROR_CODE, message);
  }
}
