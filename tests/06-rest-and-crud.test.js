const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const targetPath = process.env.TEST_SOLUTIONS === 'true'
  ? '../solutions/06-rest-and-crud/server.js'
  : '../tasks/06-rest-and-crud/server.js';

const { app, resetStudents } = require(targetPath);

describe('Task 06: Student Management CRUD Operations', () => {
  beforeEach(() => {
    if (typeof resetStudents === 'function') {
      resetStudents();
    }
  });

  test('GET /students should return all initial students', async () => {
    const res = await request(app).get('/students');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body.length, 2);
    assert.strictEqual(res.body[0].name, 'Asha');
    assert.strictEqual(res.body[1].name, 'Rahul');
  });

  test('GET /students/:id should return single student when found', async () => {
    const res = await request(app).get('/students/1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 1);
    assert.strictEqual(res.body.name, 'Asha');
  });

  test('GET /students/:id should return 404 when student does not exist', async () => {
    const res = await request(app).get('/students/999');
    assert.strictEqual(res.status, 404);
    assert.ok(res.body.error);
  });

  test('POST /students should create a new student and return 201 Created', async () => {
    const payload = { name: "Riya", course: "CSE" };
    const res = await request(app).post('/students').send(payload);
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.name, 'Riya');
    assert.strictEqual(res.body.course, 'CSE');
    assert.strictEqual(res.body.id, 3);

    // Verify it was added to collection
    const listRes = await request(app).get('/students');
    assert.strictEqual(listRes.body.length, 3);
  });

  test('PUT /students/:id should update existing student and return 200', async () => {
    const res = await request(app)
      .put('/students/2')
      .send({ course: "ECE" });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 2);
    assert.strictEqual(res.body.course, 'ECE');
    assert.strictEqual(res.body.name, 'Rahul'); // Preserved name
  });

  test('PUT /students/:id should return 404 when updating non-existent student', async () => {
    const res = await request(app)
      .put('/students/999')
      .send({ course: "ECE" });
    assert.strictEqual(res.status, 404);
    assert.ok(res.body.error);
  });

  test('DELETE /students/:id should delete student and return 200', async () => {
    const res = await request(app).delete('/students/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.message);

    // Verify student is gone
    const getRes = await request(app).get('/students/1');
    assert.strictEqual(getRes.status, 404);

    const listRes = await request(app).get('/students');
    assert.strictEqual(listRes.body.length, 1);
  });

  test('DELETE /students/:id should return 404 when deleting non-existent student', async () => {
    const res = await request(app).delete('/students/999');
    assert.strictEqual(res.status, 404);
    assert.ok(res.body.error);
  });
});
