import { BaseError } from './base.error';
import { MISSING_ACCESS_TOKEN_ERROR_CODE } from './error-codes';

export class MissingAccessTokenError extends BaseError {
  constructor() {
    super(
      MISSING_ACCESS_TOKEN_ERROR_CODE,
      'Access token is missing from the request',
    );
  }
}
