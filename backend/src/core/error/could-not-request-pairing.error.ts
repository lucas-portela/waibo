import { BaseError } from './base.error';
import { PAIRING_REQUEST_TIMEDOUT } from './error-codes';

export class CouldNotRequestPairingError extends BaseError {
  constructor(reason?: string) {
    super(
      PAIRING_REQUEST_TIMEDOUT,
      reason
        ? `Could not request pairing: ${reason}`
        : 'Could not request pairing',
    );
  }
}
