import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { InMemoryBookRepository } from '../src/repository.js';

const validBook = { title: 'Clean Code', author: 'Robert C. Martin', publishedYear: 2008 };
const app = () => createApp({ repository: new InMemoryBookRepository() });

describe('Validation & error handling', () => {
  let client;
  beforeEach(() => {
    client = request(app());
  });

  test('POST /books rejects a missing title with 400 + consistent shape', async () => {
    const res = await client.post('/books').send({ author: 'X', publishedYear: 2020 });

    assert.equal(res.status, 400);
    assert.equal(res.body.error.type, 'validation_error');
    assert.equal(res.body.error.message, 'Validation failed');
    assert.ok(Array.isArray(res.body.error.issues));
    assert.ok(res.body.error.issues.length > 0);
  });

  test('POST /books rejects a non-number publishedYear with 400', async () => {
    const res = await client
      .post('/books')
      .send({ title: 'T', author: 'A', publishedYear: 'not-a-year' });

    assert.equal(res.status, 400);
    assert.equal(res.body.error.type, 'validation_error');
  });

  test('POST /books rejects a negative publishedYear with 400', async () => {
    const res = await client
      .post('/books')
      .send({ title: 'T', author: 'A', publishedYear: -5 });

    assert.equal(res.status, 400);
  });

  test('GET /books/:id rejects a non-UUID id with 400', async () => {
    const res = await client.get('/books/not-a-uuid');
    assert.equal(res.status, 400);
    assert.equal(res.body.error.type, 'validation_error');
  });

  test('PUT /books/:id rejects an invalid body with 400', async () => {
    const res = await client
      .put('/books/00000000-0000-4000-8000-000000000000')
      .send({ author: '' });
    assert.equal(res.status, 400);
  });

  test('unmatched route returns consistent 404 shape', async () => {
    const res = await client.get('/nope');
    assert.equal(res.status, 404);
    assert.deepEqual(res.body, { error: { message: 'Not found' } });
  });

  test('unknown body (malformed JSON) yields 400, not 500', async () => {
    // express.json() throws a syntax error → rendered as 400 by error handler.
    const res = await request(app()).post('/books').set('Content-Type', 'application/json').send('{bad json');
    assert.equal(res.status, 400);
  });
});