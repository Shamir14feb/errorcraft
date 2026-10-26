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

## TypeScript support

Errorcraft is written in strict TypeScript and ships declaration files. Types available from the public entry point include the options and serialized-output types exported by the package, for example:

```typescript
import type { ErrorCraftOptions, SerializedError } from 'errorcraft';
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

- `serializeError(error, options?)` — returns a controlled error representation.
- `HttpStatus` — HTTP status code constants.
- `HttpStatusCode` — TypeScript type derived from supported status codes.
- Options and serialized-output types — see the public exports in the package's `src/index.ts`.

## License

Errorcraft is licensed under the MIT License. See [`LICENSE`](LICENSE) for details.
