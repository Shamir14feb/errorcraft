import type { BaseErrorOptions } from './error-options.js';

export abstract class BaseError extends Error {
  readonly code: string;
  readonly data?: Record<string, unknown>;

  constructor(message: string, options: BaseErrorOptions) {
    super(message, { cause: options.cause });
    this.name = new.target.name;
    this.code = options.code;
    if (options.data !== undefined) {
      this.data = options.data;
    }
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
