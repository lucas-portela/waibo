import { BaseError } from './base.error';
import { USER_NOT_FOUND_ERROR_CODE } from './error-codes';

export class UserNotFoundError extends BaseError {
  constructor() {
    super(USER_NOT_FOUND_ERROR_CODE, 'User not found');
  }
}
