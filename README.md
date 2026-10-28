# Errorcraft

**Craft better errors. Build more reliable applications.**

Errorcraft is a lightweight, framework-independent TypeScript library for reusable HTTP and application error handling in Node.js. It helps teams use consistent error classes, stable error codes, contextual metadata, native error causes, and safe serialization—without tying the library to Express, Fastify, or any web framework.

<p align="left">
  <a href="https://www.npmjs.com/package/errorcraft"><img src="https://img.shields.io/npm/v/errorcraft.svg?style=flat-square" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/errorcraft"><img src="https://img.shields.io/npm/dm/errorcraft.svg?style=flat-square" alt="npm downloads per month"></a>
  <a href="https://github.com/Shamir14feb/errorcraft/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Shamir14feb/errorcraft?style=flat-square" alt="License"></a>
  <a href="https://github.com/Shamir14feb/errorcraft/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Shamir14feb/errorcraft/ci.yml?branch=main&style=flat-square" alt="CI status"></a>
</p>

## Why Errorcraft?

Error handling often becomes inconsistent across projects: classes get duplicated, status codes are repeated, and error responses are shaped differently from service to service.

Errorcraft provides a shared foundation for defining and handling errors consistently. Use its built-in HTTP errors or extend the application-error base class for your own domain-specific failures.

## Features

- **Zero runtime dependencies** — no `http-status` package required.
- **TypeScript-first** — ships type declarations.
- **Dual module support** — ESM and CommonJS.
- **Reusable HTTP errors** — built-in classes with status codes and stable error codes.
- **Custom application errors** — extend `ApplicationError` for domain-specific failures.
- **Structured context** — attach optional `data` to errors.
- **Error causes** — preserve the original failure with native `cause` support.
- **Explicit serialization** — use `serializeError()` to produce a controlled output.
- **Result helpers** — use `tryCatch()` and `tryCatchSync()` for discriminated success and failure results.
- **Framework-independent** — use it in services, scripts, workers, or web applications.

## Installation

```bash
npm install errorcraft
```

**Requirements:** Node.js 18 or later.

## Quick start

```typescript
import { NotFoundError, ValidationError, InternalServerError } from 'errorcraft';

throw new NotFoundError('User not found');

throw new ValidationError('Invalid input', {
  data: { field: 'email' },
});

throw new InternalServerError('Database operation failed', {
  cause: originalError,
});
```

Each error provides a human-readable `message` and a stable machine-readable `code`. HTTP errors also expose a `statusCode`. Errors inherit native JavaScript stack-trace behavior.

## HTTP errors

Errorcraft provides the following HTTP error classes:

| Class                       | Status | Code                     |
| --------------------------- | -----: | ------------------------ |
| `BadRequestError`           |    400 | `BAD_REQUEST`            |
| `UnauthorizedError`         |    401 | `UNAUTHORIZED`           |
| `ForbiddenError`            |    403 | `FORBIDDEN`              |
| `NotFoundError`             |    404 | `NOT_FOUND`              |
| `MethodNotAllowedError`     |    405 | `METHOD_NOT_ALLOWED`     |
| `RequestTimeoutError`       |    408 | `REQUEST_TIMEOUT`        |
| `ConflictError`             |    409 | `CONFLICT`               |
| `GoneError`                 |    410 | `GONE`                   |
| `PayloadTooLargeError`      |    413 | `PAYLOAD_TOO_LARGE`      |
| `UnsupportedMediaTypeError` |    415 | `UNSUPPORTED_MEDIA_TYPE` |
| `UnprocessableEntityError`  |    422 | `UNPROCESSABLE_ENTITY`   |
| `ValidationError`           |    422 | `VALIDATION_ERROR`       |
| `TooManyRequestsError`      |    429 | `TOO_MANY_REQUESTS`      |
| `InternalServerError`       |    500 | `INTERNAL_SERVER_ERROR`  |
| `NotImplementedError`       |    501 | `NOT_IMPLEMENTED`        |
| `BadGatewayError`           |    502 | `BAD_GATEWAY`            |
| `ServiceUnavailableError`   |    503 | `SERVICE_UNAVAILABLE`    |
| `GatewayTimeoutError`       |    504 | `GATEWAY_TIMEOUT`        |

Each HTTP error has a readonly `statusCode`, a stable `code`, and a default message that can be overridden when constructing the error.

### Bad requests and validation errors

Use `BadRequestError` when the request is malformed or required information is missing. Use `ValidationError` when a field is present but its value fails validation. Both are useful; choose the one that best describes the failure.

```typescript
import { BadRequestError, ValidationError } from 'errorcraft';

type RegisterUserInput = {
  email?: string;
};

function registerUser(input?: RegisterUserInput) {
  if (!input || !input.email) {
    throw new BadRequestError('Email is required', {
      data: {
        field: 'email',
        reason: 'Missing required field',
      },
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    throw new ValidationError('Invalid email address', {
      data: {
        field: 'email',
        reason: 'Invalid email format',
      },
    });
  }

  // Register the user...
}
```

Use `HttpStatus` when you need a numeric status constant:

```typescript
import { HttpStatus } from 'errorcraft';

if (response.status === HttpStatus.NOT_FOUND) {
  // Handle a not-found response.
}
```

## Custom application errors

Extend `ApplicationError` to define errors for your own application. Application errors do not need to represent an HTTP response.

```typescript
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
```

You can then use your custom error like any other Errorcraft error:

```typescript
try {
  await db.query(sql);
} catch (cause) {
  throw new DatabaseError('Could not load users', {
    cause,
    data: {
      operation: 'loadUsers',
    },
  });
}
```

## Error causes

When catching an error and throwing a more meaningful one, pass the original failure as `cause`:

```typescript
try {
  await db.query(sql);
} catch (cause) {
  throw new InternalServerError('Database operation failed', {
    cause,
  });
}
```

The outer error describes the operation that failed. Its `cause` preserves the underlying failure for debugging and logging. The outer stack trace and the original cause's stack trace are separate.

## Structured error data

Use `data` to attach additional context to any error:

```typescript
throw new NotFoundError('User not found', {
  data: {
    userId: '42',
    operation: 'getUser',
  },
});
```

`data` is optional and independent of `cause`:

- `message` describes what went wrong.
- `code` identifies the error programmatically.
- `data` provides additional context.
- `cause` preserves the underlying failure.
- `stack` helps locate where the error was created.

Avoid putting secrets, credentials, tokens, or other sensitive values in error metadata.

## Safe serialization

Use `serializeError()` when you need a controlled representation of an error, such as an API response payload:

```typescript
import { NotFoundError, serializeError } from 'errorcraft';

const error = new NotFoundError('User not found', {
  data: { userId: '42' },
  cause: new Error('Database timeout'),
});

serializeError(error);
// {
//   name: 'NotFoundError',
//   message: 'User not found',
//   code: 'NOT_FOUND',
//   statusCode: 404
// }
```

By default, serialization omits `stack`, `cause`, and `data`. To include metadata explicitly:

```typescript
serializeError(error, { includeData: true });
```

Only opt in to including `data` when you have confirmed it is safe to disclose. Errorcraft does not replace your application's responsibility to choose appropriate HTTP status codes, log errors securely, or decide what information is safe to return to clients.

## Error Handling Utilities

`tryCatch()` and `tryCatchSync()` run a callback and return a **result object** instead of throwing. They complement Errorcraft’s error classes and [`serializeError()`](#safe-serialization): use the helpers to capture failures, then narrow on `result.ok` before handling `value` or `error`.

Both utilities share the same discriminated result type:

```typescript
export type TryCatchResult<T> = { ok: true; value: T } | { ok: false; error: unknown };
```

Public signatures:

```typescript
function tryCatch<T>(fn: () => T | Promise<T>): Promise<TryCatchResult<T>>;

function tryCatchSync<T>(fn: () => T): TryCatchResult<T>;
```

**Result object pattern**

- When `ok` is `true`, the operation succeeded and `value` holds the result (including `null`, `undefined`, or `void`).
- When `ok` is `false`, the operation failed and `error` holds the **original** thrown or rejected value.
- Use `if (result.ok)` / `if (!result.ok)` for TypeScript narrowing. Do not infer success from the truthiness of `value` or `error`.

**Why `error` is `unknown`**

JavaScript allows throwing any value, not only `Error` instances:

```typescript
throw new Error('Something failed');
throw 'Something failed';
throw null;
throw { code: 'PAYMENT_FAILED' };
```

`error` is typed as `unknown` because the helpers preserve whatever was thrown—they do not wrap, convert, or normalize it into an `Error`. Narrow before use:

```typescript
import { NotFoundError } from 'errorcraft';

if (!result.ok) {
  if (result.error instanceof NotFoundError) {
    // Handle a specific Errorcraft error.
  } else if (result.error instanceof Error) {
    console.error(result.error.message);
  } else {
    console.error('A non-Error value was thrown:', result.error);
  }
}
```

### `tryCatch()`

Pass the work as a **function** so synchronous exceptions during invocation and asynchronous Promise rejections are both caught inside the helper.

`getUserById` below is an illustrative application function—not part of Errorcraft.

```typescript
import { tryCatch, NotFoundError } from 'errorcraft';

const result = await tryCatch(async () => {
  const user = await getUserById('123');

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
});

if (result.ok) {
  console.log(result.value);
} else if (result.error instanceof NotFoundError) {
  console.error('User not found');
} else {
  console.error('Operation failed:', result.error);
}
```

`tryCatch()` always returns a `Promise<TryCatchResult<T>>`, even when the callback is synchronous.

### Handling Multiple Error Types

When a callback can throw several Errorcraft classes (or other values), assign `result.error` after narrowing with `!result.ok`, then branch with `instanceof`. `fetchUser` is an illustrative application function—not exported by Errorcraft.

```typescript
import {
  tryCatch,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  ConflictError,
  BaseError,
} from 'errorcraft';

const result = await tryCatch(() => createUser(input));

if (!result.ok) {
  const error = result.error;

  if (error instanceof ValidationError) {
    console.error('Invalid input');
  } else if (error instanceof ConflictError) {
    console.error('The user already exists');
  } else if (error instanceof UnauthorizedError) {
    console.error('Authentication required');
  } else if (error instanceof NotFoundError) {
    console.error('Resource not found');
  } else if (error instanceof BaseError) {
    console.error('Other Errorcraft error:', error.code);
  } else if (error instanceof Error) {
    console.error('Native error:', error.message);
  } else {
    console.error('Non-Error value:', error);
  }
}
```

**Order of checks**

- `if (!result.ok)` narrows the result so `error` is available on the failure branch.
- `error instanceof NotFoundError` (and similar) identifies a specific Errorcraft class.
- Check **specific HTTP/application subclasses before `BaseError`**, because subclasses also satisfy `instanceof BaseError`.
- The final `else` handles strings, `null`, plain objects, and other non-`Error` values—`tryCatch()` preserves the original thrown value as `unknown`, and not every failure is an `Error` instance.

> **Note:** Keep `instanceof Error` **last** among the `instanceof` branches (immediately before the non-`Error` `else`). Errorcraft errors extend `BaseError`, which extends the native `Error` class—so every `NotFoundError`, `ValidationError`, and other library error is also an `instanceof Error`. If you test `instanceof Error` too early, those failures are handled as generic JavaScript errors and the specific Errorcraft branches never run.

- `instanceof Error` — use this for native JavaScript errors that are **not** Errorcraft errors (after all `BaseError` / HTTP class checks).

For structured logging or API responses after you have handled the failure, call `serializeError(error)` separately (see [With `serializeError()`](#with-serializeerror) below).

### `tryCatchSync()`

Use for synchronous work such as parsing or in-memory transformations. The result is returned immediately; the helper does **not** `await` Promises and does **not** catch rejections that happen later on a Promise returned from the callback.

```typescript
import { tryCatchSync } from 'errorcraft';

const result = tryCatchSync(() => JSON.parse('{"name":"Errorcraft"}'));

if (result.ok) {
  console.log(result.value.name);
} else {
  console.error('Invalid JSON:', result.error);
}
```

### With `serializeError()`

`TryCatchResult` does not include a serialized error field. Serialization stays opt-in via [`serializeError()`](#safe-serialization), which accepts `unknown` and applies the library’s safe defaults (see [Safe serialization](#safe-serialization) for `includeData`).

```typescript
import { serializeError, tryCatch } from 'errorcraft';

const result = await tryCatch(() => performOperation());

if (!result.ok) {
  const serialized = serializeError(result.error);
  console.error(serialized);
}
```

- `result.error` — original thrown value (any type).
- `serializeError(result.error)` — controlled `SerializedError` shape for logging or responses; non-`BaseError` values are not turned into Errorcraft error classes automatically.

## TypeScript support

Errorcraft is written in strict TypeScript and ships declaration files. Types available from the public entry point include the options and serialized-output types exported by the package, for example:

```typescript
import type { ErrorCraftOptions, SerializedError, TryCatchResult } from 'errorcraft';
```

Check the package's public exports for the complete list of supported types.

## ESM and CommonJS

**ESM**

```typescript
import { NotFoundError } from 'errorcraft';

throw new NotFoundError('User not found');
```

**CommonJS**

```javascript
const { NotFoundError } = require('errorcraft');

throw new NotFoundError('User not found');
```

## API overview

### Core classes

- `BaseError` — abstract base class with a stable `code`, optional `data`, and native error behavior.
- `HttpError` — abstract base class for HTTP errors with a `statusCode`.
- `ApplicationError` — abstract base class for custom application errors.
- Built-in HTTP error classes — common client and server errors.
- `ValidationError` — validation error with status 422 and code `VALIDATION_ERROR`.

### Utilities and constants

- `tryCatch(fn)` — runs a callback and returns `Promise<TryCatchResult<T>>` (sync or async).
- `tryCatchSync(fn)` — runs a synchronous callback and returns `TryCatchResult<T>`.
- `TryCatchResult<T>` — `{ ok: true, value }` or `{ ok: false, error: unknown }`.
- `serializeError(error, options?)` — safe serialization; see [Safe serialization](#safe-serialization).
- `HttpStatus` — HTTP status code constants.
- `HttpStatusCode` — TypeScript type derived from supported status codes.
- Options and serialized-output types — see the public exports in the package's `src/index.ts`.

## License

Errorcraft is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.
