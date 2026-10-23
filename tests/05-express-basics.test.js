const { test, describe } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const targetPath = process.env.TEST_SOLUTIONS === 'true'
  ? '../solutions/05-express-basics/server.js'
  : '../tasks/05-express-basics/server.js';

const app = require(targetPath);

describe('Task 05: Express Basics', () => {
  test('Express app should be defined and exported', () => {
    assert.ok(app, 'Express app is not exported from server.js. Check module.exports = app;');
  });

  test('GET / should return 200 with welcome message', async () => {
    if (!app) assert.fail('App is not defined');
    const res = await request(app).get('/');
    assert.strictEqual(res.status, 200);
    assert.match(res.text, /Welcome to Express Student Management API/i);
  });

  test('GET /students should return 200 with JSON student array', async () => {
    if (!app) assert.fail('App is not defined');
    const res = await request(app).get('/students');
    assert.strictEqual(res.status, 200);
    assert.match(res.headers['content-type'], /json/);
    assert.ok(Array.isArray(res.body), 'Expected response body to be an array');
    assert.strictEqual(res.body.length, 2);
    assert.strictEqual(res.body[0].name, 'Asha');
    assert.strictEqual(res.body[1].course, 'CSE');
  });
});
