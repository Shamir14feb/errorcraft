import { describe, expect, it } from 'vitest';
import {
  BadGatewayError,
  BadRequestError,
  BaseError,
  ConflictError,
  ForbiddenError,
  GatewayTimeoutError,
  GoneError,
  HttpError,
  HttpStatus,
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  NotImplementedError,
  PayloadTooLargeError,
  RequestTimeoutError,
  ServiceUnavailableError,
  TooManyRequestsError,
  UnauthorizedError,
  UnprocessableEntityError,
  UnsupportedMediaTypeError,
  ValidationError,
} from '../src/index.js';

const httpErrorCases = [
  { ErrorClass: BadRequestError, status: HttpStatus.BAD_REQUEST, code: 'BAD_REQUEST' },
  {
    ErrorClass: UnauthorizedError,
    status: HttpStatus.UNAUTHORIZED,
    code: 'UNAUTHORIZED',
  },
  { ErrorClass: ForbiddenError, status: HttpStatus.FORBIDDEN, code: 'FORBIDDEN' },
  { ErrorClass: NotFoundError, status: HttpStatus.NOT_FOUND, code: 'NOT_FOUND' },
  {
    ErrorClass: MethodNotAllowedError,
    status: HttpStatus.METHOD_NOT_ALLOWED,
    code: 'METHOD_NOT_ALLOWED',
  },
  {
    ErrorClass: RequestTimeoutError,
    status: HttpStatus.REQUEST_TIMEOUT,
    code: 'REQUEST_TIMEOUT',
  },
  { ErrorClass: ConflictError, status: HttpStatus.CONFLICT, code: 'CONFLICT' },
  { ErrorClass: GoneError, status: HttpStatus.GONE, code: 'GONE' },
  {
    ErrorClass: PayloadTooLargeError,
    status: HttpStatus.PAYLOAD_TOO_LARGE,
    code: 'PAYLOAD_TOO_LARGE',
  },
  {
    ErrorClass: UnsupportedMediaTypeError,
    status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    code: 'UNSUPPORTED_MEDIA_TYPE',
  },
  {
    ErrorClass: UnprocessableEntityError,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    code: 'UNPROCESSABLE_ENTITY',
  },
  {
    ErrorClass: ValidationError,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    code: 'VALIDATION_ERROR',
  },
  {
    ErrorClass: TooManyRequestsError,
    status: HttpStatus.TOO_MANY_REQUESTS,
    code: 'TOO_MANY_REQUESTS',
  },
  {
    ErrorClass: InternalServerError,
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    code: 'INTERNAL_SERVER_ERROR',
  },
  {
    ErrorClass: NotImplementedError,
    status: HttpStatus.NOT_IMPLEMENTED,
    code: 'NOT_IMPLEMENTED',
  },
  { ErrorClass: BadGatewayError, status: HttpStatus.BAD_GATEWAY, code: 'BAD_GATEWAY' },
  {
    ErrorClass: ServiceUnavailableError,
    status: HttpStatus.SERVICE_UNAVAILABLE,
    code: 'SERVICE_UNAVAILABLE',
  },
  {
    ErrorClass: GatewayTimeoutError,
    status: HttpStatus.GATEWAY_TIMEOUT,
    code: 'GATEWAY_TIMEOUT',
  },
] as const;

describe('HttpError classes', () => {
  for (const { ErrorClass, status, code } of httpErrorCases) {
    it(`${ErrorClass.name} exposes status ${status} and code ${code}`, () => {
      const error = new ErrorClass();
      expect(error).toBeInstanceOf(HttpError);
      expect(error).toBeInstanceOf(BaseError);
      expect(error.statusCode).toBe(status);
      expect(error.code).toBe(code);
      expect(error.message).toBeTruthy();
    });
  }

  it('supports custom messages', () => {
    const error = new NotFoundError('User not found');
    expect(error.message).toBe('User not found');
  });

  it('supports options', () => {
    const cause = new Error('db');
    const error = new InternalServerError('Failed', { cause, data: { retry: true } });
    expect(error.cause).toBe(cause);
    expect(error.data).toEqual({ retry: true });
  });
});
