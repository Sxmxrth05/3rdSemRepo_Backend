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

// ========================================================
// STEP 1: GET /students with Query Parameter (?search=term)
// 💡 Concept: req.query.search extracts ?search= query value.
//             Filter by name or course case-insensitively using .includes().
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
app.get('/students', (req, res) => {
  const searchTerm = req.query.search;
  if (searchTerm && typeof searchTerm === 'string') {
    const term = searchTerm.trim().toLowerCase();
    const filtered = students.filter(student =>
      (student.name && student.name.toLowerCase().includes(term)) ||
      (student.course && student.course.toLowerCase().includes(term))
    );
    return res.json(filtered);
  }
  res.json(students);
});


// ========================================================
// STEP 2: GET /students/:id (with 404 error)
// 💡 Concept: Return { error: "Student not found" } with status 404.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json(student);
});


// ========================================================
// STEP 3: POST /students (with Input Validation)
// 💡 Concept: If name or course is missing/empty, reject with 400 Bad Request.
//             Otherwise return 201 Created with new student.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
app.post('/students', (req, res) => {
  const { name, course } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim() ||
    !course || typeof course !== 'string' || !course.trim()) {
    return res.status(400).json({ error: "Name and course are required fields" });
  }

  const nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
  const newStudent = {
    id: nextId,
    name: name.trim(),
    course: course.trim()
  };

  students.push(newStudent);
  res.status(201).json(newStudent);
});


// ========================================================
// STEP 4: PUT /students/:id (with Validation)
// 💡 Concept: Check if student exists (404).
//             Ensure at least one field (name or course) is provided (400).
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
app.put('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const { name, course } = req.body || {};
  const hasName = name !== undefined && typeof name === 'string' && name.trim().length > 0;
  const hasCourse = course !== undefined && typeof course === 'string' && course.trim().length > 0;

  if (!hasName && !hasCourse) {
    return res.status(400).json({ error: "At least one field (name or course) must be provided" });
  }

  if (hasName) student.name = name.trim();
  if (hasCourse) student.course = course.trim();

  res.json(student);
});


// ========================================================
// STEP 5: DELETE /students/:id
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
app.delete('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = students.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }
  students.splice(index, 1);
  res.json({ message: "Student deleted successfully" });
});


// ========================================================
// STEP 6: 404 Catch-All Middleware
// 💡 Concept: Placed after all routes to catch any unhandled endpoint.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the middleware below:
// ========================================================
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


// ========================================================
// STEP 7: Centralized 500 Error-Handling Middleware
// 💡 Concept: Express identifies error middleware by its 4 arguments (err, req, res, next).
// --------------------------------------------------------
// INSTRUCTION: Uncomment the error handler below:
// ========================================================
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err);
  res.status(500).json({ error: "Internal server error" });
});


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Validation & Error Server running on port ${PORT}`);
  });
}

// Export for automated tests (run: npm run test:08)
module.exports = { app, resetStudents };
