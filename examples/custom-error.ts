import { ApplicationError } from 'errorcraft';

export class DatabaseError extends ApplicationError {
  constructor(
    message = 'Database operation failed',
    options?: {
      cause?: unknown;
      data?: Record<string, unknown>;
    },
  ) {
    super(message, {
      code: 'DATABASE_ERROR',
      ...options,
    });
  }
}
