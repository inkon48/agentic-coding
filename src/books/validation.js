import { z } from 'zod';
import { ValidationError } from '../middlewares/error.js';

/** Zod schema for the book request body (create + full update). */
export const bookBodySchema = z.object({
  title: z.string().trim().min(1, 'title is required').max(200),
  author: z.string().trim().min(1, 'author is required').max(200),
  publishedYear: z
    .number()
    .int('publishedYear must be an integer')
    .min(0, 'publishedYear must be >= 0')
    .max(new Date().getFullYear() + 1, 'publishedYear is in the future'),
});

/** Zod schema for the `:id` path param (expects a UUID). */
export const bookIdSchema = z.string().uuid('id must be a valid UUID');

/**
 * Middleware validating `req.body` against bookBodySchema.
 * On failure, forwards a ValidationError (mapped to 400 by the error handler).
 */
export function validateBookBody(req, res, next) {
  const result = bookBodySchema.safeParse(req.body);
  if (!result.success) {
    return next(new ValidationError(result.error.issues));
  }
  req.body = result.data;
  next();
}

/**
 * Middleware validating `req.params.id` against idSchema.
 * On failure, forwards a ValidationError (mapped to 400).
 */
export function validateBookId(req, res, next) {
  const result = bookIdSchema.safeParse(req.params.id);
  if (!result.success) {
    return next(new ValidationError(result.error.issues));
  }
  req.params.id = result.data;
  next();
}