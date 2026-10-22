import { BaseError } from './base-error.js';
import type { ApplicationErrorOptions } from './error-options.js';

export abstract class ApplicationError extends BaseError {
  constructor(message: string, options: ApplicationErrorOptions) {
    super(message, options);
  }
}
