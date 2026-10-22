import { describe, expect, it } from 'vitest';
import { ApplicationError, BaseError, HttpError } from '../src/index.js';

class DatabaseError extends ApplicationError {
  constructor(
    message = 'Database operation failed',
    options?: { cause?: unknown; data?: Record<string, unknown> },
  ) {
    super(message, { code: 'DATABASE_ERROR', ...options });
  }
}

describe('custom ApplicationError subclasses', () => {
  it('allows stable custom codes without HTTP status', () => {
    const error = new DatabaseError();
    expect(error).toBeInstanceOf(ApplicationError);
    expect(error).toBeInstanceOf(BaseError);
    expect(error).not.toBeInstanceOf(HttpError);
    expect(error.code).toBe('DATABASE_ERROR');
    expect('statusCode' in error).toBe(false);
  });

  it('supports causes and metadata', () => {
    const cause = new Error('connection reset');
    const error = new DatabaseError('Query failed', {
      cause,
      data: { query: 'SELECT 1' },
    });
    expect(error.cause).toBe(cause);
    expect(error.data).toEqual({ query: 'SELECT 1' });
  });
});
