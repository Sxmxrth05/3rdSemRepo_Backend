# Task 04: HTTP Routing with Native Node.js

## 1. Task Number & Title
**Task 04**: URL-Based Routing and Content-Type Handling with Native Node.js

## 2. Concepts Covered
- URL path inspection via `req.url`
- Conditional routing (`if...else if...else` or `switch`)
- Handling multiple distinct routes (`/`, `/about`, `/students`)
- Setting appropriate HTTP status codes (`200 OK` vs `404 Not Found`)
- Serving plain text vs. JSON responses (`JSON.stringify()`, `Content-Type: application/json`)
- Fallback route handling for unknown URLs

## 3. What Students Should Understand Before Starting
- Completion of Task 03 (creating an HTTP server)
- JavaScript conditional branching (`if / else if / else`)
- How JavaScript arrays/objects are converted into JSON strings via `JSON.stringify()`

## 4. Scenario / Problem Statement
A web server cannot just return the same generic message for every request. As outlined in the Skill Lab Manual (Section 2, Figure 3), the server must inspect `req.url` and branch its response: serving a home message, an about description, a JSON list of students, and a clean 404 error if an unhandled path is requested.

## 5. Learning Objective
By completing this task, you will:
1. Extract and inspect the requested path using `req.url`.
2. Implement branching logic for `/`, `/about`, and `/students`.
3. Set the response header to `application/json` when serving structured data.
4. Return an HTTP `404 Not Found` status code when an invalid path is visited.

## 6. Setup and Execution Commands
From the repository root:
```bash
# Navigate to Task 04
cd tasks/04-http-routing

# Start the server
node server.js
```
Open your browser or Postman and test:
- [http://localhost:3000/](http://localhost:3000/)
- [http://localhost:3000/about](http://localhost:3000/about)
- [http://localhost:3000/students](http://localhost:3000/students)
- [http://localhost:3000/unknown-path](http://localhost:3000/unknown-path)

## 7. Step-by-Step Requirements
1. Open [server.js](file:///tasks/04-http-routing/server.js).
2. Follow the `TODO` markers inside the request listener:
   - Check if `req.url === '/'`:
     - Return status `200`.
     - Return body: `"Home Page"`.
   - Check if `req.url === '/about'`:
     - Return status `200`.
     - Return body: `"About Page"`.
   - Check if `req.url === '/students'`:
     - Return status `200`.
     - Set header `'Content-Type': 'application/json'`.
     - Return the JSON stringified `students` array using `JSON.stringify(students)`.
   - Otherwise (`else`):
     - Return status `404`.
     - Return body: `"Page Not Found"`.
3. Export `server` using `module.exports = server;`.

## 8. Files Students Are Expected to Modify
- [server.js](file:///tasks/04-http-routing/server.js)

## 9. API Contract
| Method | Endpoint | Status | Content-Type | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | `200 OK` | `text/plain` | `"Home Page"` |
| `GET` | `/about` | `200 OK` | `text/plain` | `"About Page"` |
| `GET` | `/students` | `200 OK` | `application/json` | `[{"id": 1, "name": "Asha", "course": "CSE"}, {"id": 2, "name": "Rahul", "course": "CSE"}]` |
| `GET` | `/*` (any other) | `404 Not Found` | `text/plain` | `"Page Not Found"` |

## 10. Expected Output & Acceptance Criteria
- Visiting `/` returns `200` with `"Home Page"`.
- Visiting `/about` returns `200` with `"About Page"`.
- Visiting `/students` returns `200` with valid JSON containing at least Asha and Rahul.
- Visiting an unmapped path (e.g. `/secret`) returns HTTP status `404` with `"Page Not Found"`.

## 11. Test Instructions
From the repository root:
```bash
npm run test:04
```

## 12. Progressive Hints
- **Hint 1 (Level 1)**: In Node's native HTTP module, `req.url` contains the path requested by the client (for example `'/'` or `'/about'`).
- **Hint 2 (Level 2)**: For `/students`, set the header to `application/json` and pass `JSON.stringify(students)` to `res.end(...)`:
  ```javascript
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(students));
  ```
- **Hint 3 (Level 3)**: Don't forget the 404 status code! In native HTTP, `res.writeHead(404, { 'Content-Type': 'text/plain' });` sets the status to 404.

## 13. Common Errors & Debugging Advice
- **Error**: Visiting `/students` returns `[object Object]` instead of real JSON.
  - *Fix*: You forgot `JSON.stringify()`. You cannot pass a raw JavaScript object to `res.end()` in native Node.js.
- **Error**: Test says "Expected status code 404, but received 200".
  - *Fix*: In the `else` block, ensure you explicitly set `res.statusCode = 404;` or `res.writeHead(404)`.

## 14. Extension Challenge (For Faster Students)
Support query parameters or ignore trailing slashes (e.g., ensure `/about/` still resolves to the About Page using `req.url.replace(/\/$/, '')`).
