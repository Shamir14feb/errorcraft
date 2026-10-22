# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-22

### Added

- `BaseError`, `HttpError`, and `ApplicationError` hierarchy with stable error codes
- Standard HTTP error classes (4xx and 5xx)
- `ValidationError` with HTTP 422 and code `VALIDATION_ERROR`
- `HttpStatus` constants and `HttpStatusCode` type
- Safe `serializeError` utility with opt-in metadata serialization
- ESM and CommonJS builds with TypeScript declarations
- Comprehensive test suite and documentation
