import { BaseError } from './base.error';
import { INVALID_PAIRING_CODE } from './error-codes';

export class InvalidPairingCodeError extends BaseError {
  constructor(code?: string) {
    super(
      INVALID_PAIRING_CODE,
      code ? `Invalid pairing code '${code}'` : 'Invalid pairing code',
    );
  }
}
