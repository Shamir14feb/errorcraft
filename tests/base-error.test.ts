import { describe, expect, it } from 'vitest';
import { ApplicationError, BaseError } from '../src/index.js';

class TestApplicationError extends ApplicationError {
  constructor(
    message = 'Test failed',
    options?: { cause?: unknown; data?: Record<string, unknown> },
  ) {
    super(message, { code: 'TEST_ERROR', ...options });
  }
}

describe('BaseError', () => {
  it('extends native Error', () => {
    const error = new TestApplicationError();
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(BaseError);
    expect(error).toBeInstanceOf(ApplicationError);
    expect(error).toBeInstanceOf(TestApplicationError);
  });

  it('sets name, message, and code', () => {
    const error = new TestApplicationError('Something went wrong');
    expect(error.name).toBe('TestApplicationError');
    expect(error.message).toBe('Something went wrong');
    expect(error.code).toBe('TEST_ERROR');
  });

  it('supports optional metadata', () => {
    const error = new TestApplicationError('Invalid', { data: { field: 'email' } });
    expect(error.data).toEqual({ field: 'email' });
  });

  it('supports native error causes', () => {
    const cause = new Error('root');
    const error = new TestApplicationError('Wrapped', { cause });
    expect(error.cause).toBe(cause);
  });

  it('captures stack traces', () => {
    const error = new TestApplicationError();
    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('TestApplicationError');
  });
});
