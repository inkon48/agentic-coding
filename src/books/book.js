import { randomUUID } from 'node:crypto';

/**
 * Canonical Book shape used across repositories and routes.
 * All fields are plain, serializable JSON.
 */
export function createBook({ title, author, publishedYear }) {
  const now = new Date().toISOString();
  return {
    id: randomUUID(),
    title,
    author,
    publishedYear,
    createdAt: now,
    updatedAt: now,
  };
}