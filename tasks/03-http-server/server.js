/**
 * Task 03: Basic HTTP Server with Native Node.js http Module
 *
 * Requirements:
 * - Create an HTTP server using http.createServer()
 * - Return status 200 with "Welcome to Node.js Server"
 * - Listen on port 3000
 */

// ========================================================
// STEP 1: Require the Built-in 'http' Module
// 💡 Concept: The 'http' module allows Node.js to transfer data over HTTP.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the line below:
// ========================================================
const http = require('http');

const PORT = 3000;

// ========================================================
// STEP 2: Create the HTTP Server
// 💡 Concept: http.createServer() takes a callback with request (req) and response (res).
//             res.writeHead(200, ...) sets HTTP status and response headers.
//             res.end(...) sends the response payload and closes connection.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the server creation block below:
// ========================================================
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end("Welcome to Node.js Server");
});

// ========================================================
// STEP 3: Listen on PORT 3000
// 💡 Concept: server.listen() starts the server to receive network traffic.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the listener block below:
// ========================================================
if (require.main === module && typeof server !== 'undefined' && server) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export server for automated tests (run: npm run test:03)
module.exports = typeof server !== 'undefined' ? server : null;
