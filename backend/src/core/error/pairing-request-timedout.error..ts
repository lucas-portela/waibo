import { BaseError } from './base.error';
import { PAIRING_REQUEST_TIMEDOUT } from './error-codes';

export class PairingRequestTimedoutError extends BaseError {
  constructor() {
    super(PAIRING_REQUEST_TIMEDOUT, 'Pairing request timed out');
  }
}
