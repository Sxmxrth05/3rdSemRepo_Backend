const { test, describe } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const targetPath = process.env.TEST_SOLUTIONS === 'true'
  ? '../solutions/04-http-routing/server.js'
  : '../tasks/04-http-routing/server.js';

const server = require(targetPath);

describe('Task 04: Native HTTP Routing', () => {
  test('GET / should return 200 with "Home Page"', async () => {
    const res = await request(server).get('/');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.text.trim(), 'Home Page');
  });

  test('GET /about should return 200 with "About Page"', async () => {
    const res = await request(server).get('/about');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.text.trim(), 'About Page');
  });

  test('GET /students should return 200 with JSON student array', async () => {
    const res = await request(server).get('/students');
    assert.strictEqual(res.status, 200);
    assert.match(res.headers['content-type'], /json/);
    const body = JSON.parse(res.text);
    assert.ok(Array.isArray(body), 'Expected body to be an array');
    assert.strictEqual(body.length, 2);
    assert.strictEqual(body[0].name, 'Asha');
  });

  test('GET /unknown-path should return 404 with "Page Not Found"', async () => {
    const res = await request(server).get('/unknown-path');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.text.trim(), 'Page Not Found');
  });
});
