# Errorcraft

**Craft better errors. Build more reliable applications.**

Errorcraft is a framework-independent TypeScript library for reusable HTTP and application error handling. It provides stable error codes, structured metadata, native `cause` support, and safe serialization—without tying you to Express, Fastify, or any web framework.

## Installation

```bash
npm install errorcraft
```

## Features

- Zero runtime dependencies
- TypeScript-first with shipped declaration files
- ESM and CommonJS builds
- Standard HTTP error classes with correct status codes
- Extensible `ApplicationError` for domain-specific errors
- Stable machine-readable `code` on every error
- Optional structured `data` metadata
- Native `Error` `cause` chaining
- Explicit, safe `serializeError` for API responses

## Basic usage

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

## HTTP errors

Each HTTP error class exposes a readonly `statusCode`, a stable `code`, and a sensible default `message`:

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

Use `HttpStatus` when you need numeric constants without throwing:

```typescript
import { HttpStatus } from 'errorcraft';

if (response.status === HttpStatus.NOT_FOUND) {
  // ...
}
```

## Custom application errors

Extend `ApplicationError` to define domain errors without HTTP semantics:

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

See [examples/custom-error.ts](examples/custom-error.ts) for a complete example.

## Error causes

Pass the original failure as `cause` when wrapping errors:

```typescript
try {
  await db.query(sql);
} catch (err) {
  throw new InternalServerError('Database operation failed', { cause: err });
}
```

The `cause` is preserved for logging and debugging but is **not** included in default serialization.

## Safe serialization

Use `serializeError` to produce a JSON-safe payload for clients:

```typescript
import { NotFoundError, serializeError } from 'errorcraft';

const error = new NotFoundError('User not found', {
  data: { userId: '42' },
  cause: new Error('db timeout'),
});

serializeError(error);
// { name: 'NotFoundError', message: 'User not found', code: 'NOT_FOUND', statusCode: 404 }
```

By default, serialization **omits** `stack`, `cause`, and `data`. To include metadata you control, opt in explicitly:

```typescript
serializeError(error, { includeData: true });
```

Only pass `includeData: true` when the metadata is safe to disclose.

## TypeScript support

Errorcraft is written in strict TypeScript. Types are exported for options and serialized shapes:

```typescript
import type { ErrorCraftOptions, SerializedError } from 'errorcraft';
```

## ESM and CommonJS

**ESM:**

```typescript
import { NotFoundError } from 'errorcraft';
```

**CommonJS:**

```javascript
const { NotFoundError } = require('errorcraft');
```

## Node.js versions

Node.js **18+** is required (`engines.node >= 18`).

## API reference

### Classes

- `BaseError` — abstract base with `code`, optional `data`, and `cause`
- `HttpError` — abstract HTTP base with `statusCode`
- `ApplicationError` — abstract base for custom application errors
- HTTP error classes listed in the table above
- `ValidationError` — validation failures (422, `VALIDATION_ERROR`)

### Functions

- `serializeError(error, options?)` — safe serialization for responses and logs

### Constants and types

- `HttpStatus` — standard HTTP status code constants
- `HttpStatusCode` — union of status code numbers
- `ErrorCraftOptions`, `HttpErrorOptions`, `ApplicationErrorOptions`, `BaseErrorOptions`, `SerializedError`, `SerializeErrorOptions`

## Contributing

1. Fork the repository and create a branch.
2. Install dependencies: `npm install`
3. Run checks: `npm run lint && npm run typecheck && npm test`

**Git hooks (Husky):**

- **pre-commit:** lint-staged (ESLint fix + Prettier on staged files)
- **pre-push:** `npm run typecheck` → `npm run build` → `npm test` (tests validate the built `dist/` output)

4. Open a pull request with a clear description of the change.

## License

MIT — see [LICENSE](LICENSE).
