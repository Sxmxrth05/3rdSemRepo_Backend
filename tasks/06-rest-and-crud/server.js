/**
 * Task 06: Student Management REST API (CRUD Operations)
 *
 * Endpoints:
 * - GET    /students       (Read all students)
 * - GET    /students/:id   (Read student by ID)
 * - POST   /students       (Create new student -> 201 Created)
 * - PUT    /students/:id   (Update existing student)
 * - DELETE /students/:id   (Delete student)
 */

const express = require('express');
const app = express();

const PORT = 3000;

// ========================================================
// STEP 1: Enable JSON Body Parsing Middleware
// 💡 Concept: express.json() parses incoming request bodies with JSON payloads
//             and populates req.body. Without this, req.body is undefined!
// --------------------------------------------------------
// INSTRUCTION: Uncomment the line below:
// ========================================================
app.use(express.json());

let students = [
  { id: 1, name: "Asha", course: "CSE" },
  { id: 2, name: "Rahul", course: "CSE" }
];

function resetStudents() {
  students = [
    { id: 1, name: "Asha", course: "CSE" },
    { id: 2, name: "Rahul", course: "CSE" }
  ];
}

// ========================================================
// STEP 2: GET /students (Retrieve all students)
// 💡 Concept: Returns full list of students with HTTP 200 OK.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
app.get('/students', (req, res) => {
  res.json(students);
});


// ========================================================
// STEP 3: GET /students/:id (Retrieve single student by ID)
// 💡 Concept: Route parameters are accessed via req.params.
//             Convert req.params.id string to number using parseInt().
//             Return 404 Not Found if student doesn't exist.
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
// STEP 4: POST /students (Create new student)
// 💡 Concept: Read { name, course } from req.body.
//             Auto-generate unique ID: Math.max(...ids) + 1.
//             Return HTTP 201 Created with the new student object.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
app.post('/students', (req, res) => {
  const { name, course } = req.body;
  const nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
  const newStudent = { id: nextId, name, course };
  students.push(newStudent);
  res.status(201).json(newStudent);
});


// ========================================================
// STEP 5: PUT /students/:id (Update student)
// 💡 Concept: Find existing student by ID (or return 404).
//             Update fields provided in req.body.
//             Return updated student object with HTTP 200 OK.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
app.put('/students/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  if (req.body.name !== undefined) student.name = req.body.name;
  if (req.body.course !== undefined) student.course = req.body.course;
  res.json(student);
});


// ========================================================
// STEP 6: DELETE /students/:id (Delete student)
// 💡 Concept: Find index using findIndex(). If -1, return 404.
//             Remove item using students.splice(index, 1).
//             Return success message with HTTP 200 OK.
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


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`CRUD Server running on port ${PORT}`);
  });
}

// Export app and reset helper for automated tests (run: npm run test:06)
module.exports = { app, resetStudents };
