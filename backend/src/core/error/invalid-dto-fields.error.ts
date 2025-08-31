import { BaseError } from './base.error';
import { INVALID_DTO_FIELDS_ERROR_CODE } from './error-codes';

export class InvalidDtoFieldsError extends BaseError {
  constructor(
    public errors: {
      path: (string | number | symbol)[];
      message: string;
      code?: string;
    }[],
  ) {
    super(INVALID_DTO_FIELDS_ERROR_CODE, 'Invalid fields values');
  }
}
