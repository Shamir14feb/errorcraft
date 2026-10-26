export type TryCatchResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: unknown;
    };

export async function tryCatch<T>(
  fn: () => T | Promise<T>,
): Promise<TryCatchResult<T>> {
  try {
    const value = await fn();
    return { ok: true, value };
  } catch (error) {
    return { ok: false, error };
  }
}

export function tryCatchSync<T>(fn: () => T): TryCatchResult<T> {
  try {
    const value = fn();
    return { ok: true, value };
  } catch (error) {
    return { ok: false, error };
  }
}
