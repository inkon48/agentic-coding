import pg from 'pg';

const { Pool } = pg;

/** Maps a Postgres row to the canonical Book JSON shape. */
function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    publishedYear: row.published_year,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Async BookRepository backed by PostgreSQL (node-postgres / Neon).
 * Implements the same interface as InMemoryBookRepository so the two are
 * swappable behind the routes.
 */
export class PostgresBookRepository {
  constructor(connectionString) {
    this.pool = new Pool({ connectionString });
  }

  async create({ title, author, publishedYear }) {
    const { rows } = await this.pool.query(
      `INSERT INTO books_demo (title, author, published_year, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, title, author, published_year, created_at, updated_at`,
      [title, author, publishedYear]
    );
    return mapRow(rows[0]);
  }

  async list({ title, author } = {}) {
    const conditions = [];
    const params = [];

    if (title) {
      params.push(title);
      conditions.push(`title ILIKE '%' || $${params.length} || '%'`);
    }
    if (author) {
      params.push(author);
      conditions.push(`author ILIKE '%' || $${params.length} || '%'`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await this.pool.query(
      `SELECT id, title, author, published_year, created_at, updated_at
       FROM books_demo ${where} ORDER BY created_at ASC`,
      params
    );
    return rows.map(mapRow);
  }

  async getById(id) {
    const { rows } = await this.pool.query(
      `SELECT id, title, author, published_year, created_at, updated_at
       FROM books_demo WHERE id = $1`,
      [id]
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async update(id, { title, author, publishedYear }) {
    const { rows } = await this.pool.query(
      `UPDATE books_demo
       SET title = $1, author = $2, published_year = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, title, author, published_year, created_at, updated_at`,
      [title, author, publishedYear, id]
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async delete(id) {
    const { rowCount } = await this.pool.query('DELETE FROM books_demo WHERE id = $1', [id]);
    return (rowCount ?? 0) > 0;
  }
}