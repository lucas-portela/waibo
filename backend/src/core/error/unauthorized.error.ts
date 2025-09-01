import { BaseError } from './base.error';
import { UNAUTHORIZED_ERROR_CODE } from './error-codes';

export class UnauthorizedError extends BaseError {
  constructor(message?: string) {
    super(
      UNAUTHORIZED_ERROR_CODE,
      message || "You don't have permission to access this resource",
    );
  }
}
