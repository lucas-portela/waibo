import { BaseError } from './base.error';
import { PAIRING_CODE_EXPIRED } from './error-codes';

export class PairingCodeExpiredError extends BaseError {
  constructor(code?: string) {
    super(
      PAIRING_CODE_EXPIRED,
      code ? `Pairing code '${code}' has expired` : 'Pairing code has expired',
    );
  }
}
