/**
 * Task 05: Express Basics
 *
 * Requirements:
 * - Initialize an Express application
 * - GET /         -> 200 "Welcome to Express Student Management API"
 * - GET /students -> 200 JSON array of students
 * - Listen on port 3000
 */

const express = require('express');
const app = express();

const PORT = 3000;

const students = [
  { id: 1, name: "Asha", course: "CSE" },
  { id: 2, name: "Rahul", course: "CSE" }
];

// ========================================================
// STEP 1: GET / (Root Route)
// 💡 Concept: app.get(path, handler) routes HTTP GET requests.
//             res.send() automatically sets status 200 and Content-Type.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
// app.get('/', (req, res) => {
//   res.send("Welcome to Express Student Management API");
// });


// ========================================================
// STEP 2: GET /students (JSON Endpoint)
// 💡 Concept: res.json(data) automatically formats data as JSON
//             and sets 'Content-Type: application/json'.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the route below:
// ========================================================
// app.get('/students', (req, res) => {
//   res.json(students);
// });


// ========================================================
// STEP 3: Start Server Listener on PORT 3000
// --------------------------------------------------------
// INSTRUCTION: Uncomment the listener block below:
// ========================================================
// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`Express server running on port ${PORT}`);
//   });
// }

// Export app for automated tests (run: npm run test:05)
module.exports = app;
