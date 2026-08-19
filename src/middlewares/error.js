/**
 * Centralized error handling with a single, consistent JSON error shape:
 *   { error: { message, type?, issues? } }
 */

export class ValidationError extends Error {
  constructor(issues, message = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.issues = issues;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

/** 404 for unmatched routes (URL not found). */
export function notFoundHandler(req, res) {
  res.status(404).json({ error: { message: 'Not found' } });
}

/** Final error middleware: maps known errors, hides internals for 500s. */
export function errorHandler(err, req, res, next) {
  // Known application errors.
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: { type: 'validation_error', message: err.message, issues: err.issues },
    });
  }
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({ error: { message: err.message } });
  }

  // HTTP-level errors surfaced by middleware (e.g. body-parser's malformed JSON,
  // which sets a `status`/`statusCode`). Respond 4xx with a safe message.
  const status = err.statusCode || err.status;
  if (status && status >= 400 && status < 500) {
    return res.status(status).json({ error: { message: err.message || 'Bad request' } });
  }

  // Unexpected errors: log details, respond with a safe generic message.
  console.error(err);
  res.status(500).json({ error: { message: 'Internal server error' } });
}