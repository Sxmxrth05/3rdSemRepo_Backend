/**
 * Task 05: Express Basics & JSON Responses
 *
 * Requirements:
 * - Initialize an Express application
 * - Route GET / -> "Welcome to Express Student Management API"
 * - Route GET /students -> JSON array of students
 * - Listen on port 3000
 */

// TODO 1: Require the 'express' package
const express = require('express');

// TODO 2: Initialize the Express app
const app = express();

const PORT = 3000;

// Sample initial student data
const students = [
  { id: 1, name: "Asha", course: "CSE" },
  { id: 2, name: "Rahul", course: "CSE" }
];

// TODO 3: Create a GET route for '/'
// Return the string: "Welcome to Express Student Management API"
app.get('/', (req, res) => {
  res.send("Welcome to Express Student Management API");
});

// TODO 4: Create a GET route for '/students'
// Return the students array as JSON
app.get('/students', (req, res) => {
  res.json(students);
});

// Listen on port 3000 if executed directly
if (require.main === module && typeof app !== 'undefined') {
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

// Export the app for automated testing
module.exports = app;
