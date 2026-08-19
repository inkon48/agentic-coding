import { createBook } from './book.js';

/**
 * Async, in-memory book store backing the BookRepository interface.
 * Used when no database is configured (and by fast unit/integration tests).
 */
export class InMemoryBookRepository {
  #books = new Map();

  /** @returns {Promise<object>} the created book */
  async create({ title, author, publishedYear }) {
    const book = createBook({ title, author, publishedYear });
    this.#books.set(book.id, book);
    return book;
  }

  /** @returns {Promise<object[]>} all books, optionally filtered */
  async list({ title, author } = {}) {
    let books = [...this.#books.values()];

    if (title) {
      const q = title.toLowerCase();
      books = books.filter((b) => b.title.toLowerCase().includes(q));
    }
    if (author) {
      const q = author.toLowerCase();
      books = books.filter((b) => b.author.toLowerCase().includes(q));
    }

    return books;
  }

  /** @returns {Promise<object|null>} the book, or null when absent */
  async getById(id) {
    return this.#books.get(id) ?? null;
  }

  /** @returns {Promise<object|null>} the updated book, or null when absent */
  async update(id, { title, author, publishedYear }) {
    const existing = this.#books.get(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      title,
      author,
      publishedYear,
      updatedAt: new Date().toISOString(),
    };
    this.#books.set(id, updated);
    return updated;
  }

  /** @returns {Promise<boolean>} true when a book was removed */
  async delete(id) {
    return this.#books.delete(id);
  }
}