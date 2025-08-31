import { BaseError } from './base.error';
import { USER_ONLY_ENDPOINT_ERROR_CODE } from './error-codes';

export class UserOnlyEndpointError extends BaseError {
  constructor() {
    super(
      USER_ONLY_ENDPOINT_ERROR_CODE,
      'This feature is only available for regular users',
    );
  }
}
