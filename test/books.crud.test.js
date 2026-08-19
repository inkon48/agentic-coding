import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { InMemoryBookRepository } from '../src/repository.js';

const validBook = { title: 'Clean Code', author: 'Robert C. Martin', publishedYear: 2008 };

function makeApp() {
  return createApp({ repository: new InMemoryBookRepository() });
}

async function seedBook(app, overrides = {}) {
  const res = await request(app)
    .post('/books')
    .send({ ...validBook, ...overrides });
  assert.equal(res.status, 201);
  return res.body;
}

describe('Books CRUD (in-memory repository)', () => {
  let app;

  beforeEach(() => {
    app = makeApp();
  });

  test('POST /books creates a book', async () => {
    const res = await request(app).post('/books').send(validBook);

    assert.equal(res.status, 201);
    assert.equal(res.body.title, validBook.title);
    assert.equal(res.body.author, validBook.author);
    assert.equal(res.body.publishedYear, validBook.publishedYear);
    assert.ok(res.body.id);
    assert.ok(res.body.createdAt);
  });

  test('GET /books returns the full list', async () => {
    await seedBook(app, { title: 'A' });
    await seedBook(app, { title: 'B' });

    const res = await request(app).get('/books');
    assert.equal(res.status, 200);
    assert.equal(Array.isArray(res.body), true);
    assert.equal(res.body.length, 2);
  });

  test('GET /books/:id returns one book', async () => {
    const created = await seedBook(app);
    const res = await request(app).get(`/books/${created.id}`);

    assert.equal(res.status, 200);
    assert.deepEqual(res.body.id, created.id);
  });

  test('GET /books/:id returns 404 for a missing book', async () => {
    const id = '00000000-0000-4000-8000-000000000000';
    const res = await request(app).get(`/books/${id}`);

    assert.equal(res.status, 404);
    assert.equal(res.body.error.message, 'Book not found');
  });

  test('PUT /books/:id updates a book', async () => {
    const created = await seedBook(app);
    const res = await request(app)
      .put(`/books/${created.id}`)
      .send({ ...validBook, title: 'Clean Code (2nd ed.)' });

    assert.equal(res.status, 200);
    assert.equal(res.body.title, 'Clean Code (2nd ed.)');
    assert.equal(res.body.id, created.id);
  });

  test('PUT /books/:id returns 404 for a missing book', async () => {
    const id = '00000000-0000-4000-8000-000000000000';
    const res = await request(app).put(`/books/${id}`).send(validBook);

    assert.equal(res.status, 404);
  });

  test('DELETE /books/:id removes a book (204, then 404)', async () => {
    const created = await seedBook(app);
    const del = await request(app).delete(`/books/${created.id}`);

    assert.equal(del.status, 204);

    const after = await request(app).get(`/books/${created.id}`);
    assert.equal(after.status, 404);
  });

  test('DELETE /books/:id returns 404 for a missing book', async () => {
    const id = '00000000-0000-4000-8000-000000000000';
    const res = await request(app).delete(`/books/${id}`);
    assert.equal(res.status, 404);
  });

  test('list is isolated between app instances (fresh store per repo)', async () => {
    await seedBook(app, { title: 'Only in appA' });
    const appB = makeApp();
    const res = await request(appB).get('/books');
    assert.equal(res.body.length, 0);
  });
});