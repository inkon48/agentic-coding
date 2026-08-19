import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { InMemoryBookRepository } from '../src/repository.js';

const base = { author: 'Author', publishedYear: 2020 };
const app = () => createApp({ repository: new InMemoryBookRepository() });

async function seed(client, data) {
  return client.post('/books').send(data).expect(201);
}

describe('Search / filtering (in-memory repository)', () => {
  let client;
  beforeEach(async () => {
    client = request(app());
    await seed(client, { ...base, title: 'The Great Gatsby' });
    await seed(client, { ...base, title: 'Gatsby Unbound' });
    await seed(client, { ...base, title: 'Moby Dick' });
  });

  test('?title= filters case-insensitively by substring', async () => {
    const res = await client.get('/books?title=gatsby');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 2);
    assert.ok(res.body.every((b) => b.title.toLowerCase().includes('gatsby')));
  });

  test('?author= filters by substring', async () => {
    // Reset store: author all the same above, so add a distinct author.
    const client2 = request(app());
    await seed(client2, { ...base, title: 'A Distinct Book', author: 'Someone Else' });
    const res = await client2.get('/books?author=someone');
    assert.equal(res.status, 200);
    assert.ok(res.body.every((b) => b.author.toLowerCase().includes('someone')));
  });

  test('?title= with no matches returns empty array', async () => {
    const res = await client.get('/books?title=zzzz');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, []);
  });

  test('no filters returns the full list', async () => {
    const res = await client.get('/books');
    assert.equal(res.status, 200);
    assert.equal(res.body.length, 3);
  });
});