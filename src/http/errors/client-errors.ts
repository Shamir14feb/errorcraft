import { HttpError, type HttpErrorOptions } from '../http-error.js';
import { HttpStatus } from '../http-status.js';

export class BadRequestError extends HttpError {
  constructor(message = 'Bad Request', options?: HttpErrorOptions) {
    super(message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST', options);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized', options?: HttpErrorOptions) {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', options);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden', options?: HttpErrorOptions) {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN', options);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found', options?: HttpErrorOptions) {
    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND', options);
  }
}

export class MethodNotAllowedError extends HttpError {
  constructor(message = 'Method Not Allowed', options?: HttpErrorOptions) {
    super(message, HttpStatus.METHOD_NOT_ALLOWED, 'METHOD_NOT_ALLOWED', options);
  }
}

export class RequestTimeoutError extends HttpError {
  constructor(message = 'Request Timeout', options?: HttpErrorOptions) {
    super(message, HttpStatus.REQUEST_TIMEOUT, 'REQUEST_TIMEOUT', options);
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Conflict', options?: HttpErrorOptions) {
    super(message, HttpStatus.CONFLICT, 'CONFLICT', options);
  }
}

export class GoneError extends HttpError {
  constructor(message = 'Gone', options?: HttpErrorOptions) {
    super(message, HttpStatus.GONE, 'GONE', options);
  }
}

export class PayloadTooLargeError extends HttpError {
  constructor(message = 'Payload Too Large', options?: HttpErrorOptions) {
    super(message, HttpStatus.PAYLOAD_TOO_LARGE, 'PAYLOAD_TOO_LARGE', options);
  }
}

export class UnsupportedMediaTypeError extends HttpError {
  constructor(message = 'Unsupported Media Type', options?: HttpErrorOptions) {
    super(
      message,
      HttpStatus.UNSUPPORTED_MEDIA_TYPE,
      'UNSUPPORTED_MEDIA_TYPE',
      options,
    );
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = 'Unprocessable Entity', options?: HttpErrorOptions) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, 'UNPROCESSABLE_ENTITY', options);
  }
}

export class ValidationError extends HttpError {
  constructor(message = 'Validation failed', options?: HttpErrorOptions) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', options);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message = 'Too Many Requests', options?: HttpErrorOptions) {
    super(message, HttpStatus.TOO_MANY_REQUESTS, 'TOO_MANY_REQUESTS', options);
  }
}
