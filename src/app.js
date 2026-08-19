import { readFileSync } from 'node:fs';
import express from 'express';
import cors from 'cors';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
import { healthRouter } from './routes/health.js';
import { createBooksRouter } from './books/routes.js';
import { createBookRepository } from './repository.js';
import { errorHandler, notFoundHandler } from './middlewares/error.js';

// Load + parse the OpenAPI 3 spec once so Swagger UI can render it.
const OPENAPI_SPEC = yaml.parse(readFileSync(new URL('../docs/openapi.yml', import.meta.url), 'utf8'));

/**
 * Build and wire the Express app. Does NOT start a server (that's server.js);
 * accepting an injected repository keeps the app unit-testable.
 */
export function createApp({ repository } = {}) {
  const app = express();

  // Enable CORS for cross-origin browser clients. By default this allows all
  // origins; restrict with a `CORS_ORIGIN` allowlist if needed (see README).
  app.use(cors(process.env.CORS_ORIGIN ? { origin: process.env.CORS_ORIGIN.split(',') } : undefined));

  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/books', createBooksRouter(repository ?? createBookRepository()));

  // Interactive API documentation (Swagger UI) renders the OpenAPI spec.
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(OPENAPI_SPEC));

  // Ordered 404 + error handling must be last.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}