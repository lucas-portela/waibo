import { BaseError } from './base.error';
import { ADMIN_ONLY_ENDPOINT_ERROR_CODE } from './error-codes';

export class AdminOnlyEndpointError extends BaseError {
  constructor() {
    super(
      ADMIN_ONLY_ENDPOINT_ERROR_CODE,
      'This feature is only available for admin users',
    );
  }
}
