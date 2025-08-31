import { BaseError } from './base.error';
import { USER_NOT_FOUND_ERROR_CODE } from './error-codes';

export class UserNotFoundError extends BaseError {
  constructor(userId: string) {
    super(USER_NOT_FOUND_ERROR_CODE, `User ${userId} not found`);
  }
}
