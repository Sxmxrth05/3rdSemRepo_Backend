/**
 * Task 04: HTTP Routing with Native Node.js
 *
 * Requirements:
 * - GET /         -> 200 "Home Page"
 * - GET /about    -> 200 "About Page"
 * - GET /students -> 200 JSON Array of students
 * - Catch-all     -> 404 "Page Not Found"
 */

const http = require('http');

const PORT = 3000;

const students = [
  { id: 1, name: "Asha", course: "CSE" },
  { id: 2, name: "Rahul", course: "CSE" }
];

// ========================================================
// STEP 1: Create Server with URL Routing
// 💡 Concept: Inspect req.url to determine the client's destination.
//             Handle trailing slashes using .replace(/\/$/, '').
//             Return 404 for unmapped paths.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the server block below:
// ========================================================
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const urlPath = req.url.length > 1 ? req.url.replace(/\/$/, '') : req.url;

  if (urlPath === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    res.end("Home Page");
  } else if (urlPath === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    res.end("About Page");
  } else if (urlPath === '/students') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(students));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    res.end("Page Not Found");
  }
});

// ========================================================
// STEP 2: Listen on PORT 3000
// --------------------------------------------------------
// INSTRUCTION: Uncomment the listener block below:
// ========================================================
if (require.main === module && typeof server !== 'undefined' && server) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export server for automated tests (run: npm run test:04)
module.exports = typeof server !== 'undefined' ? server : null;
