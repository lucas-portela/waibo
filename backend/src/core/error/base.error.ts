export class BaseError extends Error {
  readonly code: string;
  readonly message: string;

  constructor(code: string, message: string) {
    super();
    this.message = message;
    this.name = this.constructor.name;
    this.code = code;
  }
}
