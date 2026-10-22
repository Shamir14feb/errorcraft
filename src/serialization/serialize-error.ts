import { BaseError } from '../core/base-error.js';
import type { SerializeErrorOptions, SerializedError } from '../core/error-options.js';
import { HttpError } from '../http/http-error.js';

export function serializeError(
  error: unknown,
  options?: SerializeErrorOptions,
): SerializedError {
  if (error instanceof BaseError) {
    const serialized: SerializedError = {
      name: error.name,
      message: error.message,
      code: error.code,
    };

    if (error instanceof HttpError) {
      serialized.statusCode = error.statusCode;
    }

    if (options?.includeData && error.data !== undefined) {
      serialized.data = error.data;
    }

    return serialized;
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  return {
    name: 'Error',
    message: String(error),
    code: 'UNKNOWN_ERROR',
  };
}
