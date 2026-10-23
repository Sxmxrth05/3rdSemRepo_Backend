/**
 * Task 09: Final Challenge - Student Management REST API
 *
 * Full Capstone API:
 * 1. GET    /students           (all students + ?search= support)
 * 2. GET    /students/:id       (single student by ID)
 * 3. POST   /students           (create student with validation)
 * 4. PUT    /students/:id       (update student with validation)
 * 5. DELETE /students/:id       (delete student)
 * 6. 404 Catch-All Middleware   (unmapped routes)
 * 7. Centralized Error Handler  (500 internal errors)
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
// STEP 1: GET /students (with ?search= filter)
// 💡 Concept: If ?search= is supplied, filter students by name or course.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
// app.get('/students', (req, res) => {
//   const searchTerm = req.query.search;
//   if (searchTerm && typeof searchTerm === 'string') {
//     const term = searchTerm.trim().toLowerCase();
//     const results = students.filter(student =>
//       (student.name && student.name.toLowerCase().includes(term)) ||
//       (student.course && student.course.toLowerCase().includes(term))
//     );
//     return res.json(results);
//   }
//   res.json(students);
// });


// ========================================================
// STEP 2: GET /students/:id (Retrieve single student)
// 💡 Concept: Return student if found, or 404 with error message.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
// app.get('/students/:id', (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   const student = students.find(s => s.id === id);
//   if (!student) {
//     return res.status(404).json({ error: "Student not found" });
//   }
//   res.json(student);
// });


// ========================================================
// STEP 3: POST /students (Create student with validation)
// 💡 Concept: Validate name and course (400 if invalid).
//             Assign next unique ID and return 201 Created.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
// app.post('/students', (req, res) => {
//   const { name, course } = req.body || {};
//
//   if (!name || typeof name !== 'string' || !name.trim() ||
//       !course || typeof course !== 'string' || !course.trim()) {
//     return res.status(400).json({ error: "Name and course are required fields" });
//   }
//
//   const nextId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
//   const newStudent = {
//     id: nextId,
//     name: name.trim(),
//     course: course.trim()
//   };
//
//   students.push(newStudent);
//   res.status(201).json(newStudent);
// });


// ========================================================
// STEP 4: PUT /students/:id (Update student with validation)
// 💡 Concept: Return 404 if not found; return 400 if no valid fields provided.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
// app.put('/students/:id', (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   const student = students.find(s => s.id === id);
//   if (!student) {
//     return res.status(404).json({ error: "Student not found" });
//   }
//
//   const { name, course } = req.body || {};
//   const hasName = name !== undefined && typeof name === 'string' && name.trim().length > 0;
//   const hasCourse = course !== undefined && typeof course === 'string' && course.trim().length > 0;
//
//   if (!hasName && !hasCourse) {
//     return res.status(400).json({ error: "At least one field (name or course) must be provided" });
//   }
//
//   if (hasName) student.name = name.trim();
//   if (hasCourse) student.course = course.trim();
//
//   res.json(student);
// });


// ========================================================
// STEP 5: DELETE /students/:id (Delete student)
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
// app.delete('/students/:id', (req, res) => {
//   const id = parseInt(req.params.id, 10);
//   const index = students.findIndex(s => s.id === id);
//   if (index === -1) {
//     return res.status(404).json({ error: "Student not found" });
//   }
//   students.splice(index, 1);
//   res.json({ message: "Student deleted successfully" });
// });


// ========================================================
// STEP 6: 404 Catch-All Middleware
// --------------------------------------------------------
// INSTRUCTION: Uncomment the middleware below:
// ========================================================
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });


// ========================================================
// STEP 7: Centralized Error Handler (500)
// --------------------------------------------------------
// INSTRUCTION: Uncomment the error handler below:
// ========================================================
// app.use((err, req, res, next) => {
//   console.error("Server Error:", err);
//   res.status(500).json({ error: "Internal server error" });
// });


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Capstone API Server running on port ${PORT}`);
  });
}

// Export for automated tests (run: npm run test:09)
module.exports = { app, resetStudents };
