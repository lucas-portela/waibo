import { BaseError } from './base.error';
import { INVALID_CONFIGURATION_ERROR_CODE } from './error-codes';

export class InvalidConfigurationError extends BaseError {
  constructor(configKey: string) {
    super(
      INVALID_CONFIGURATION_ERROR_CODE,
      `Missing or invalid configuration for key: ${configKey}`,
    );
  }
}
