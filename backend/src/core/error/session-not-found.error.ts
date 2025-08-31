import { BaseError } from './base.error';
import { SESSION_NOT_FOUND_ERROR } from './error-codes';

export class SessionNotFoundError extends BaseError {
  constructor(sessionId: string) {
    super(SESSION_NOT_FOUND_ERROR, `Session with ID '${sessionId}' not found`);
  }
}
