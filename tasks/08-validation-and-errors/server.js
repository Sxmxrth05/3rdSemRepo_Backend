/**
 * Task 08: Input Validation, Error Handling & Search
 *
 * Implements:
 * - Query parameter search on GET /students?search=...
 * - Validation on POST /students (400 Bad Request if missing name or course)
 * - Validation on PUT /students/:id (400 if empty body, 404 if not found)
 * - 404 catch-all middleware for unmapped routes
 * - Centralized 500 error-handling middleware
 */

const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());

let students = [
  { id: 1, name: "Asha", course: "CSE" },
  { id: 2, name: "Rahul", course: "ECE" }
];

function resetStudents() {
  students = [
    { id: 1, name: "Asha", course: "CSE" },
    { id: 2, name: "Rahul", course: "ECE" }
  ];
}

// 1. GET /students (with optional ?search= query)
app.get('/students', (req, res) => {
  // TODO 1:
  // If req.query.search is present:
  //   Filter students by name or course case-insensitively
  //   Return the filtered list
  // Else:
  //   Return the full students list
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// 2. GET /students/:id
app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json(student);
});

// 3. POST /students (with input validation)
app.post('/students', (req, res) => {
  // TODO 2:
  // Validate that req.body.name and req.body.course are provided and not empty strings
  // If invalid, return 400 Bad Request with { error: "Name and course are required fields" }
  // If valid, generate next id, add new student to array, and return 201 Created
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// 4. PUT /students/:id (with validation)
app.put('/students/:id', (req, res) => {
  // TODO 3:
  // Find student by id. If not found, return 404
  // If neither name nor course is provided in req.body, return 400 with { error: "At least one field (name or course) must be provided" }
  // Update the fields that were provided
  // Return 200 with updated student
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// 5. DELETE /students/:id
app.delete('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = students.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }
  students.splice(index, 1);
  res.json({ message: "Student deleted successfully" });
});

// TODO 4: 404 Catch-All Middleware for unhandled routes
// Any request that didn't match a route above should return 404 with { error: "Route not found" }
// Hint: app.use((req, res) => { ... });
// YOUR CODE HERE:


// TODO 5: Centralized 500 Error-Handling Middleware
// Hint: app.use((err, req, res, next) => { ... });
// YOUR CODE HERE:


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Validation & Error Server running on port ${PORT}`);
  });
}

module.exports = { app, resetStudents };
