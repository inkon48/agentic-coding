import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { PostgresBookRepository, InMemoryBookRepository } from '../src/repository.js';
import { runMigrations } from '../src/db.js';

// DB-backed tests only run when a dedicated test database is configured, so
// `npm test` stays green in environments without Postgres (falls back to the
// in-memory suite). Set TEST_DATABASE_URL to a disposable Postgres/Neon DB.
const TEST_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
const skip = !TEST_URL;

describe('PostgreSQL persistence', { skip }, () => {
  test('books survive a repository "restart" (reconnect)', async () => {
    await runMigrations(TEST_URL);

    // Write with one connection ("process 1").
    const writer = new PostgresBookRepository(TEST_URL);
    const created = await writer.create({
      title: 'Persisted Book',
      author: 'Resilient Author',
      publishedYear: 1999,
    });

    // Simulate a server/app restart with a brand-new repository instance.
    const reader = new PostgresBookRepository(TEST_URL);
    const fetched = await reader.getById(created.id);
    assert.ok(fetched, 'book should survive a restart');
    assert.equal(fetched.title, 'Persisted Book');

    // Update + filter against the DB repository.
    const updated = await reader.update(created.id, {
      title: 'Persisted Book (updated)',
      author: 'Resilient Author',
      publishedYear: 2000,
    });
    assert.equal(updated.title, 'Persisted Book (updated)');

    const filtered = await reader.list({ author: 'Resilient' });
    assert.equal(filtered.length, 1);

    // Clean up.
    await reader.delete(created.id);
    assert.equal(await reader.getById(created.id), null);
  });

  test('full HTTP CRUD works against the DB-backed app', async () => {
    await runMigrations(TEST_URL);
    const app = createApp({ repository: new PostgresBookRepository(TEST_URL) });
    const client = request(app);

    const created = await client
      .post('/books')
      .send({ title: 'HTTP DB Book', author: 'A', publishedYear: 2021 })
      .expect(201);
    const id = created.body.id;

    const got = await client.get(`/books/${id}`).expect(200);
    assert.equal(got.body.title, 'HTTP DB Book');

    const list = await client.get('/books?title=http db').expect(200);
    assert.ok(list.body.some((b) => b.id === id));

    await client.delete(`/books/${id}`).expect(204);
    await client.get(`/books/${id}`).expect(404);
  });

  test('in-memory repository is the async fallback (sanity)', async () => {
    const app = createApp({ repository: new InMemoryBookRepository() });
    const created = await request(app)
      .post('/books')
      .send({ title: 'In Mem', author: 'B', publishedYear: 2022 })
      .expect(201);
    assert.ok(created.body.id);
  });
});