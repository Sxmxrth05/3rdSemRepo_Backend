# Task 03: Creating an HTTP Server with Node.js

## 1. Task Number & Title
**Task 03**: Creating an HTTP Server using Node.js's Built-in `http` Module

## 2. Concepts Covered
- The HTTP protocol (HyperText Transfer Protocol)
- Node.js built-in `http` module
- Creating an HTTP server with `http.createServer()`
- Request (`req`) and Response (`res`) objects
- Setting HTTP response status codes (`res.statusCode = 200`) and headers (`res.setHeader`)
- Finalizing the response using `res.end()`
- Binding and listening to a network port (`server.listen(3000)`)

## 3. What Students Should Understand Before Starting
- Completion of Tasks 01 and 02
- Difference between client (browser/Postman) and server
- What an IP port is (`localhost:3000`)

## 4. Scenario / Problem Statement
Before adopting high-level frameworks like Express, backend developers must understand how Node.js communicates at the native HTTP layer. You will build a lightweight HTTP server using only Node.js's native `http` module. When a client visits `http://localhost:3000`, the server will respond with status code `200` and the welcome message specified in the lab manual.

## 5. Learning Objective
By completing this task, you will:
1. Import Node's built-in `http` module without any third-party dependencies.
2. Instantiate an HTTP server using `http.createServer()`.
3. Configure the HTTP status code (`200`) and `Content-Type` header (`text/plain`).
4. Send an HTTP response body using `res.end()`.
5. Start the server on port `3000` and view it in a browser or terminal.

## 6. Setup and Execution Commands
From the repository root:
```bash
# Navigate to Task 03
cd tasks/03-http-server

# Start the server
node server.js
```
Open your browser and navigate to:
[http://localhost:3000](http://localhost:3000)

To stop the server in your terminal, press `Ctrl + C`.

## 7. Step-by-Step Requirements
1. Open [server.js](file:///tasks/03-http-server/server.js).
2. Follow the `TODO` markers:
   - Import the `http` module: `const http = require('http');`.
   - Define port: `const PORT = 3000;`.
   - Create the server callback with `(req, res)` parameters:
     - Set response status code to `200`.
     - Set response header `'Content-Type': 'text/plain'`.
     - Send the message: `"Welcome to Node.js Server"` using `res.end()`.
   - Call `server.listen(PORT, ...)` and log `"Server running on port 3000"`.
   - Export `server` using `module.exports = server;` so tests can verify it.

## 8. Files Students Are Expected to Modify
- [server.js](file:///tasks/03-http-server/server.js)

## 9. API Contract
| Method | Endpoint | Expected Status | Response Headers | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | `200 OK` | `Content-Type: text/plain` | `"Welcome to Node.js Server"` |

## 10. Expected Output & Acceptance Criteria
When running `node server.js`:
```text
Server running on port 3000
```
Visiting `http://localhost:3000` displays:
```text
Welcome to Node.js Server
```

### Acceptance Criteria:
- [ ] Server starts without crashes on port `3000`.
- [ ] Making a GET request returns HTTP status `200`.
- [ ] Response body contains `"Welcome to Node.js Server"`.
- [ ] Response header `Content-Type` is set to `text/plain`.

## 11. Test Instructions
From the repository root, run the automated test:
```bash
npm run test:03
```

## 12. Progressive Hints
- **Hint 1 (Level 1)**: The built-in `http` module does not need `npm install`. Use `const http = require('http');`.
- **Hint 2 (Level 2)**: Inside `http.createServer((req, res) => { ... })`, you can use `res.writeHead(200, { 'Content-Type': 'text/plain' });` to set both the status code and header at once.
- **Hint 3 (Level 3)**: Always remember to call `res.end("Welcome to Node.js Server")`. If you omit `res.end()`, the browser will wait indefinitely!

## 13. Common Errors & Debugging Advice
- **Error**: `listen EADDRINUSE: address already in use :::3000`
  - *Fix*: Another process is already running on port 3000. Stop it with `Ctrl+C` in the terminal where it is running, or refer to [troubleshooting.md](file:///docs/troubleshooting.md).
- **Error**: Browser keeps spinning with "Waiting for localhost..."
  - *Fix*: You forgot to call `res.end()`. Node.js doesn't finish an HTTP response until you explicitly call `res.end()`.

## 14. Extension Challenge (For Faster Students)
Log each incoming request's HTTP method (`req.method`) and URL (`req.url`) with a timestamp in the console whenever a client makes a request.
