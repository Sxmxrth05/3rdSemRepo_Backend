const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const targetPath = process.env.TEST_SOLUTIONS === 'true'
  ? '../solutions/03-http-server/server.js'
  : '../tasks/03-http-server/server.js';

const server = require(targetPath);

describe('Task 03: Native HTTP Server', () => {
  test('server should be defined and be an HTTP server instance', () => {
    assert.ok(server, 'Server is not exported from server.js. Check module.exports = server;');
  });

  test('GET / should return 200 OK with "Welcome to Node.js Server"', async () => {
    if (!server) {
      assert.fail('Server is not defined in server.js');
    }
    const response = await request(server).get('/');
    assert.strictEqual(response.status, 200, 'Expected status code 200');
    assert.strictEqual(response.text.trim(), 'Welcome to Node.js Server', 'Expected response text to match "Welcome to Node.js Server"');
  });
});
