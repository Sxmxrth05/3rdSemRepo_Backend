/**
 * Task 09: Final Challenge - Student Management REST API
 *
 * SKELETON STARTER FILE
 *
 * Implement all route handlers according to the API contract in TASK.md:
 * 1. GET    /students           (all students + ?search= support)
 * 2. GET    /students/:id       (single student by ID)
 * 3. POST   /students           (create student with validation)
 * 4. PUT    /students/:id       (update student with validation)
 * 5. DELETE /students/:id       (delete student)
 * 6. 404 Catch-All Middleware   (unmapped routes)
 */

const express = require('express');
const app = express();

const PORT = 3000;

// Middleware to parse JSON payloads
app.use(express.json());

// In-memory data store
let students = [
  { id: 1, name: "Asha", course: "CSE" },
  { id: 2, name: "Rahul", course: "ECE" }
];

// Helper to reset data between test runs
function resetStudents() {
  students = [
    { id: 1, name: "Asha", course: "CSE" },
    { id: 2, name: "Rahul", course: "ECE" }
  ];
}

// ==========================================
// TODO 1: GET /students
// Retrieve all students. If ?search=term is present,
// filter students by name or course (case-insensitive).
// Return 200 OK with the array.
// ==========================================
app.get('/students', (req, res) => {
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// ==========================================
// TODO 2: GET /students/:id
// Retrieve a student by integer ID.
// If found: return 200 OK with student object.
// If not found: return 404 Not Found with { error: "Student not found" }.
// ==========================================
app.get('/students/:id', (req, res) => {
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// ==========================================
// TODO 3: POST /students
// Create a new student.
// Validate that `name` and `course` are provided and non-empty.
// If invalid: return 400 Bad Request with { error: "Name and course are required fields" }.
// If valid: generate next unique ID, append to array, and return 201 Created with new student.
// ==========================================
app.post('/students', (req, res) => {
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// ==========================================
// TODO 4: PUT /students/:id
// Update an existing student by integer ID.
// If student not found: return 404 Not Found.
// If neither name nor course is provided: return 400 Bad Request.
// Update supplied fields and return 200 OK with updated student.
// ==========================================
app.put('/students/:id', (req, res) => {
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// ==========================================
// TODO 5: DELETE /students/:id
// Remove a student by integer ID.
// If not found: return 404 Not Found.
// If found: remove from array and return 200 OK with { message: "Student deleted successfully" }.
// ==========================================
app.delete('/students/:id', (req, res) => {
  // YOUR CODE HERE:
  res.status(501).json({ error: "Not implemented yet" });
});

// ==========================================
// TODO 6: Catch-All 404 Middleware
// For any unmapped URL, return 404 Not Found with { error: "Route not found" }.
// Hint: app.use((req, res) => { ... });
// ==========================================
// YOUR CODE HERE:


// Start the server if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Student Management API running on http://localhost:${PORT}`);
  });
}

// Export for test suite
module.exports = { app, resetStudents };
