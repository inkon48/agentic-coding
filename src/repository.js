import { InMemoryBookRepository } from './books/inMemoryRepository.js';
import { PostgresBookRepository } from './books/postgresRepository.js';

export function createBookRepository() {
  // Prefer PostgreSQL/Neon when a connection string is configured;
  // otherwise fall back to the async in-memory store (also used by tests).
  const url = process.env.DATABASE_URL || process.env.TEST_DATABASE_URL;
  if (url) return new PostgresBookRepository(url);
  return new InMemoryBookRepository();
}

export { InMemoryBookRepository, PostgresBookRepository };