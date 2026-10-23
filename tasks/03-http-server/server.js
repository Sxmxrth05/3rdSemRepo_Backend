/**
 * Task 03: Basic HTTP Server with Native Node.js http Module
 *
 * Requirements:
 * - Create an HTTP server using http.createServer()
 * - Return status 200 with "Welcome to Node.js Server"
 * - Listen on port 3000
 */

// TODO 1: Require the built-in 'http' module
// const http = ...;


const PORT = 3000;

// TODO 2: Create the HTTP server
// Use http.createServer((req, res) => {
//   Set status code 200 and Content-Type: text/plain
//   Send the response text: "Welcome to Node.js Server"
// });
const server = null; // Replace with your http.createServer(...) implementation


// TODO 3: Listen on PORT if executed directly
if (require.main === module && server) {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the server for automated tests
module.exports = server;
