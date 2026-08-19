import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { InMemoryBookRepository } from '../src/repository.js';

describe('GET /health', () => {
  test('responds 200 with the documented contract', async () => {
    const app = createApp({ repository: new InMemoryBookRepository() });
    const res = await request(app).get('/health');

    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { status: 'ok' });
  });
});