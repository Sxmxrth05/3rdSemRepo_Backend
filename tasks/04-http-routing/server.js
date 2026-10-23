/**
 * Task 04: HTTP Routing with Native Node.js
 *
 * Requirements:
 * - '/' -> 200 "Home Page"
 * - '/about' -> 200 "About Page"
 * - '/students' -> 200 JSON array of students
 * - unknown -> 404 "Page Not Found"
 */

const http = require('http');

const PORT = 3000;

// Sample initial students data
const students = [
  { id: 1, name: "Asha", course: "CSE" },
  { id: 2, name: "Rahul", course: "CSE" }
];

const server = http.createServer((req, res) => {
  // TODO 1: Route: '/'
  // Check if req.url === '/'
  // Set status 200, Content-Type text/plain, return "Home Page"
  // YOUR CODE HERE:


  // TODO 2: Route: '/about'
  // Check if req.url === '/about'
  // Set status 200, Content-Type text/plain, return "About Page"
  // YOUR CODE HERE:


  // TODO 3: Route: '/students'
  // Check if req.url === '/students'
  // Set status 200, Content-Type application/json, return JSON.stringify(students)
  // YOUR CODE HERE:


  // TODO 4: Fallback / Unknown route
  // For any other path:
  // Set status 404, Content-Type text/plain, return "Page Not Found"
  // YOUR CODE HERE:


  // Starter fallback: Prevents server/browser from hanging before student implements routing above.
  res.writeHead(501, { 'Content-Type': 'text/plain' });
  res.end("Not Implemented: Implement routes according to TASK.md");
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = server;
