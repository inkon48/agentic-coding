import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { InMemoryBookRepository } from '../src/repository.js';

const app = () => createApp({ repository: new InMemoryBookRepository() });

describe('Swagger UI at /api-docs', () => {
  test('GET /api-docs redirects to the trailing-slash Swagger UI', async () => {
    const res = await request(app()).get('/api-docs');

    assert.equal(res.status, 301);
    assert.match(res.headers.location || '', /\/api-docs\/$/);
  });

  test('GET /api-docs/ serves the Swagger UI HTML', async () => {
    const res = await request(app()).get('/api-docs/');

    assert.equal(res.status, 200);
    assert.match(res.headers['content-type'], /text\/html/);
    assert.match(res.text, /swagger-ui/i);
  });

  test('Swagger UI exposes the spec JSON at /api-docs/swagger-ui-init.js', async () => {
    const res = await request(app()).get('/api-docs/swagger-ui-init.js');
    assert.equal(res.status, 200);
    // Contains a serialized spec object including our endpoint.
    assert.match(res.text, /\/books/);
  });
});