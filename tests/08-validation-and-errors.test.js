const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const targetPath = process.env.TEST_SOLUTIONS === 'true'
  ? '../solutions/08-validation-and-errors/server.js'
  : '../tasks/08-validation-and-errors/server.js';

const { app, resetStudents } = require(targetPath);

describe('Task 08: Validation, Errors & Search', () => {
  beforeEach(() => {
    if (typeof resetStudents === 'function') {
      resetStudents();
    }
  });

  test('POST /students should reject request when name is missing (400)', async () => {
    const res = await request(app)
      .post('/students')
      .send({ course: "CSE" });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.error, /required/i);
  });

  test('POST /students should reject request when course is missing or empty (400)', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: "Asha", course: "   " });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.error, /required/i);
  });

  test('POST /students should succeed and return 201 when inputs are valid', async () => {
    const res = await request(app)
      .post('/students')
      .send({ name: "Riya", course: "CSE" });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.name, "Riya");
    assert.strictEqual(res.body.id, 3);
  });

  test('GET /students?search=asha should return matching student (case-insensitive)', async () => {
    const res = await request(app).get('/students?search=ASHA');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].name, "Asha");
  });

  test('GET /students?search=ECE should filter by course', async () => {
    const res = await request(app).get('/students?search=ece');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].name, "Rahul");
  });

  test('PUT /students/:id should return 400 if body is completely empty', async () => {
    const res = await request(app)
      .put('/students/1')
      .send({});
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error);
  });

  test('GET /unmapped-path should trigger 404 middleware with JSON error', async () => {
    const res = await request(app).get('/api/unmapped-endpoint-xyz');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error, "Route not found");
  });
});
