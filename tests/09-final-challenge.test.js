const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');

const targetPath = process.env.TEST_SOLUTIONS === 'true'
  ? '../solutions/09-final-challenge/server.js'
  : '../tasks/09-final-challenge/server.js';

const { app, resetStudents } = require(targetPath);

describe('Task 09: Final Challenge - Student Management REST API', () => {
  beforeEach(() => {
    if (typeof resetStudents === 'function') {
      resetStudents();
    }
  });

  test('app should be an Express application', () => {
    assert.ok(app, 'app must be exported from server.js');
    assert.strictEqual(typeof app.listen, 'function', 'app must be an Express application');
  });

  test('1. GET /students should retrieve all initial students with status 200', async () => {
    const res = await request(app).get('/students');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.body), 'Response body must be an array');
    assert.strictEqual(res.body.length, 2);
    assert.strictEqual(res.body[0].name, 'Asha');
  });

  test('2. GET /students?search=... should filter students case-insensitively', async () => {
    const res = await request(app).get('/students?search=ASHA');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.length, 1);
    assert.strictEqual(res.body[0].name, 'Asha');

    const resCourse = await request(app).get('/students?search=ece');
    assert.strictEqual(resCourse.status, 200);
    assert.strictEqual(resCourse.body.length, 1);
    assert.strictEqual(resCourse.body[0].name, 'Rahul');
  });

  test('3. GET /students/:id should return single student when found', async () => {
    const res = await request(app).get('/students/1');
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 1);
    assert.strictEqual(res.body.name, 'Asha');
    assert.strictEqual(res.body.course, 'CSE');
  });

  test('4. GET /students/:id should return 404 when student does not exist', async () => {
    const res = await request(app).get('/students/999');
    assert.strictEqual(res.status, 404);
    assert.ok(res.body.error, 'Response should contain error property');
  });

  test('5. POST /students should reject empty body with 400 Bad Request', async () => {
    const res = await request(app).post('/students').send({});
    assert.strictEqual(res.status, 400);
    assert.match(res.body.error, /required/i);
  });

  test('6. POST /students should reject missing course with 400 Bad Request', async () => {
    const res = await request(app).post('/students').send({ name: "Priya" });
    assert.strictEqual(res.status, 400);
    assert.match(res.body.error, /required/i);
  });

  test('7. POST /students should create student, assign unique ID, and return 201 Created', async () => {
    const res = await request(app).post('/students').send({ name: "Riya", course: "CSE" });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.id, 3);
    assert.strictEqual(res.body.name, "Riya");
    assert.strictEqual(res.body.course, "CSE");

    // Verify addition
    const listRes = await request(app).get('/students');
    assert.strictEqual(listRes.body.length, 3);
  });

  test('8. PUT /students/:id should update existing student and return 200 OK', async () => {
    const res = await request(app).put('/students/2').send({ course: "ISE" });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.id, 2);
    assert.strictEqual(res.body.course, "ISE");
    assert.strictEqual(res.body.name, "Rahul"); // Preserved original name
  });

  test('9. PUT /students/:id should return 404 when updating non-existent student', async () => {
    const res = await request(app).put('/students/999').send({ course: "ISE" });
    assert.strictEqual(res.status, 404);
    assert.ok(res.body.error);
  });

  test('10. PUT /students/:id should return 400 when body is empty', async () => {
    const res = await request(app).put('/students/1').send({});
    assert.strictEqual(res.status, 400);
    assert.ok(res.body.error);
  });

  test('11. DELETE /students/:id should remove student and return 200 OK', async () => {
    const res = await request(app).delete('/students/1');
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.message);

    const getRes = await request(app).get('/students/1');
    assert.strictEqual(getRes.status, 404);

    const listRes = await request(app).get('/students');
    assert.strictEqual(listRes.body.length, 1);
  });

  test('12. DELETE /students/:id should return 404 when deleting non-existent student', async () => {
    const res = await request(app).delete('/students/999');
    assert.strictEqual(res.status, 404);
    assert.ok(res.body.error);
  });

  test('13. Catch-all middleware should return 404 for unmapped routes', async () => {
    const res = await request(app).get('/api/invalid-route');
    assert.strictEqual(res.status, 404);
    assert.strictEqual(res.body.error, 'Route not found');
  });
});
