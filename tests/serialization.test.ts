import { describe, expect, it } from 'vitest';
import {
  ApplicationError,
  InternalServerError,
  NotFoundError,
  serializeError,
  ValidationError,
} from '../src/index.js';

class DatabaseError extends ApplicationError {
  constructor(message = 'Database operation failed') {
    super(message, { code: 'DATABASE_ERROR', data: { secret: 'token' } });
  }
}

describe('serializeError', () => {
  it('serializes HTTP errors with safe fields only by default', () => {
    const cause = new Error('root');
    const error = new NotFoundError('User not found', {
      cause,
      data: { userId: '123' },
    });
    const serialized = serializeError(error);

    expect(serialized).toEqual({
      name: 'NotFoundError',
      message: 'User not found',
      code: 'NOT_FOUND',
      statusCode: 404,
    });
    expect(serialized).not.toHaveProperty('stack');
    expect(serialized).not.toHaveProperty('cause');
    expect(serialized).not.toHaveProperty('data');
  });

  it('includes metadata only when opted in', () => {
    const error = new ValidationError('Invalid input', { data: { field: 'email' } });
    expect(serializeError(error)).not.toHaveProperty('data');
    expect(serializeError(error, { includeData: true })).toEqual({
      name: 'ValidationError',
      message: 'Invalid input',
      code: 'VALIDATION_ERROR',
      statusCode: 422,
      data: { field: 'email' },
    });
  });

  it('serializes application errors without statusCode', () => {
    const error = new DatabaseError();
    const serialized = serializeError(error);
    expect(serialized).toEqual({
      name: 'DatabaseError',
      message: 'Database operation failed',
      code: 'DATABASE_ERROR',
    });
    expect(serialized.statusCode).toBeUndefined();
  });

  it('does not recursively serialize nested errors', () => {
    const error = new InternalServerError('Failed', { cause: new Error('nested') });
    const serialized = serializeError(error);
    expect(JSON.stringify(serialized)).not.toContain('nested');
  });

  it('falls back safely for native errors', () => {
    const error = new Error('boom');
    expect(serializeError(error)).toEqual({
      name: 'Error',
      message: 'boom',
      code: 'UNKNOWN_ERROR',
    });
  });

  it('does not expose cause on native Error instances', () => {
    const error = new Error('boom', { cause: new Error('internal detail') });
    const serialized = serializeError(error);
    expect(serialized).toEqual({
      name: 'Error',
      message: 'boom',
      code: 'UNKNOWN_ERROR',
    });
    expect(serialized).not.toHaveProperty('cause');
    expect(JSON.stringify(serialized)).not.toContain('internal detail');
  });

  it('serializes unknown non-error values without throwing', () => {
    expect(serializeError(null)).toEqual({
      name: 'Error',
      message: 'null',
      code: 'UNKNOWN_ERROR',
    });
  });
});
