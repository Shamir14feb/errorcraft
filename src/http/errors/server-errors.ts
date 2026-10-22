import { HttpError, type HttpErrorOptions } from '../http-error.js';
import { HttpStatus } from '../http-status.js';

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error', options?: HttpErrorOptions) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR', options);
  }
}

export class NotImplementedError extends HttpError {
  constructor(message = 'Not Implemented', options?: HttpErrorOptions) {
    super(message, HttpStatus.NOT_IMPLEMENTED, 'NOT_IMPLEMENTED', options);
  }
}

export class BadGatewayError extends HttpError {
  constructor(message = 'Bad Gateway', options?: HttpErrorOptions) {
    super(message, HttpStatus.BAD_GATEWAY, 'BAD_GATEWAY', options);
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message = 'Service Unavailable', options?: HttpErrorOptions) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE, 'SERVICE_UNAVAILABLE', options);
  }
}

export class GatewayTimeoutError extends HttpError {
  constructor(message = 'Gateway Timeout', options?: HttpErrorOptions) {
    super(message, HttpStatus.GATEWAY_TIMEOUT, 'GATEWAY_TIMEOUT', options);
  }
}
