/**
 * Task 06: Student Management REST API (CRUD)
 *
 * Implements:
 * - GET    /students       (Read all)
 * - GET    /students/:id   (Read one)
 * - POST   /students       (Create)
 * - PUT    /students/:id   (Update)
 * - DELETE /students/:id   (Delete)
 */

const express = require('express');
const app = express();

const PORT = 3000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

// In-memory data store for students
let students = [
  { id: 1, name: "Asha", course: "CSE" },
  { id: 2, name: "Rahul", course: "CSE" }
];

// Helper to reset data during automated tests
function resetStudents() {
  students = [
    { id: 1, name: "Asha", course: "CSE" },
    { id: 2, name: "Rahul", course: "CSE" }
  ];
}

// 1. GET /students - Retrieve all students
app.get('/students', (req, res) => {
  // TODO: Return all students in the array as JSON
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// 2. GET /students/:id - Retrieve a single student by id
app.get('/students/:id', (req, res) => {
  // TODO: Parse id from req.params.id
  // Find student in students array
  // If not found, return 404 with { error: "Student not found" }
  // If found, return 200 with student object
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// 3. POST /students - Create a new student
app.post('/students', (req, res) => {
  // TODO: Extract name and course from req.body
  // Generate a unique id
  // Create student object { id, name, course }
  // Add to students array
  // Return status 201 with newly created student
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// 4. PUT /students/:id - Update an existing student
app.put('/students/:id', (req, res) => {
  // TODO: Parse id from req.params.id
  // Find student in students array
  // If not found, return 404 with { error: "Student not found" }
  // Update name and course if provided in req.body
  // Return status 200 with updated student
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// 5. DELETE /students/:id - Delete a student by id
app.delete('/students/:id', (req, res) => {
  // TODO: Parse id from req.params.id
  // Find student index in students array
  // If not found (index === -1), return 404 with { error: "Student not found" }
  // Remove student from array using splice
  // Return status 200 with { message: "Student deleted successfully" }
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CRUD Server running on port ${PORT}`);
  });
}

module.exports = { app, resetStudents };
