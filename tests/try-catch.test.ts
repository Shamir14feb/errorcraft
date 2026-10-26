import { describe, expect, expectTypeOf, it } from 'vitest';
import { tryCatch, tryCatchSync } from '../src/index.js';

describe('tryCatch', () => {
  it('returns value from a successful synchronous callback', async () => {
    const result = await tryCatch(() => 42);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(42);
    }
  });

  it('returns value from a successful asynchronous callback', async () => {
    const result = await tryCatch(async () => 'async');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe('async');
    }
  });

  it('catches Promise rejection', async () => {
    const rejection = new Error('rejected');
    const result = await tryCatch(async () => {
      throw rejection;
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(rejection);
    }
  });

  it('catches synchronous exceptions from the callback', async () => {
    const thrown = new Error('sync throw');
    const result = await tryCatch(() => {
      throw thrown;
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(thrown);
    }
  });

  it('supports null and undefined successful return values', async () => {
    const nullResult = await tryCatch(() => null);
    expect(nullResult.ok).toBe(true);
    if (nullResult.ok) {
      expect(nullResult.value).toBeNull();
    }

    const undefinedResult = await tryCatch(() => undefined);
    expect(undefinedResult.ok).toBe(true);
    if (undefinedResult.ok) {
      expect(undefinedResult.value).toBeUndefined();
    }
  });

  it('supports a successful void callback', async () => {
    const result = await tryCatch(() => {});
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeUndefined();
    }
  });

  it('preserves thrown non-Error values', async () => {
    const cases = [null, undefined, 'failure', 0, { code: 'X' }] as const;
    for (const thrown of cases) {
      const result = await tryCatch(() => {
        throw thrown;
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(thrown);
      }
    }
  });

  it('narrows the result type with ok checks', async () => {
    const result = await tryCatch(() => 'value');
    if (result.ok) {
      expectTypeOf(result.value).toEqualTypeOf<string>();
    } else {
      expectTypeOf(result.error).toEqualTypeOf<unknown>();
    }
  });
});

describe('tryCatchSync', () => {
  it('returns value from a successful callback', () => {
    const result = tryCatchSync(() => ({ id: 1 }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toEqual({ id: 1 });
    }
  });

  it('catches synchronous exceptions', () => {
    const thrown = new Error('parse failed');
    const result = tryCatchSync(() => {
      throw thrown;
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(thrown);
    }
  });

  it('supports null and undefined successful return values', () => {
    const nullResult = tryCatchSync(() => null);
    expect(nullResult.ok).toBe(true);
    if (nullResult.ok) {
      expect(nullResult.value).toBeNull();
    }

    const undefinedResult = tryCatchSync(() => undefined);
    expect(undefinedResult.ok).toBe(true);
    if (undefinedResult.ok) {
      expect(undefinedResult.value).toBeUndefined();
    }
  });

  it('supports a successful void callback', () => {
    const result = tryCatchSync(() => {});
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeUndefined();
    }
  });

  it('preserves thrown non-Error values', () => {
    const thrown = 'invalid json';
    const result = tryCatchSync(() => {
      throw thrown;
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBe(thrown);
    }
  });

  it('does not return a Promise and does not catch later Promise rejection', async () => {
    const rejection = new Error('later');
    const result = tryCatchSync(() => Promise.reject(rejection));
    expect(result).not.toBeInstanceOf(Promise);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeInstanceOf(Promise);
      await expect(result.value).rejects.toBe(rejection);
    }
  });

  it('narrows the result type with ok checks', () => {
    const result = tryCatchSync(() => 1);
    if (result.ok) {
      expectTypeOf(result.value).toEqualTypeOf<number>();
    } else {
      expectTypeOf(result.error).toEqualTypeOf<unknown>();
    }
  });
});
