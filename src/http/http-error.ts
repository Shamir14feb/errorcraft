import { BaseError } from '../core/base-error.js';
import type { ErrorCraftOptions } from '../core/error-options.js';
import type { HttpStatusCode } from './http-status.js';

export type HttpErrorOptions = ErrorCraftOptions;

export abstract class HttpError extends BaseError {
  readonly statusCode: HttpStatusCode;

  constructor(
    message: string,
    statusCode: HttpStatusCode,
    code: string,
    options?: HttpErrorOptions,
  ) {
    super(message, { code, ...options });
    this.statusCode = statusCode;
  }
}
