export { BaseError } from './core/base-error.js';
export { ApplicationError } from './core/application-error.js';
export type {
  ErrorCraftOptions,
  ApplicationErrorOptions,
  BaseErrorOptions,
  SerializedError,
  SerializeErrorOptions,
} from './core/error-options.js';

export { HttpError, type HttpErrorOptions } from './http/http-error.js';
export { HttpStatus, type HttpStatusCode } from './http/http-status.js';

export {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  MethodNotAllowedError,
  RequestTimeoutError,
  ConflictError,
  GoneError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
  UnprocessableEntityError,
  ValidationError,
  TooManyRequestsError,
} from './http/errors/client-errors.js';

export {
  InternalServerError,
  NotImplementedError,
  BadGatewayError,
  ServiceUnavailableError,
  GatewayTimeoutError,
} from './http/errors/server-errors.js';

export { serializeError } from './serialization/serialize-error.js';

export { tryCatch, tryCatchSync, type TryCatchResult } from './utils/try-catch.js';
