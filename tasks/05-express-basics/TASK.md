# Task 05: Express.js Fundamentals & JSON Responses

## 1. Task Number & Title
**Task 05**: Introduction to Express.js Framework and Serving JSON Data

## 2. Concepts Covered
- What Express.js is and how it simplifies Node.js backend development
- Initializing an Express application using `express()`
- Defining routes with HTTP methods (`app.get()`)
- Sending plain text with `res.send()`
- Sending native JSON responses with `res.json()`
- Starting and binding an Express server using `app.listen()`

## 3. What Students Should Understand Before Starting
- Completion of Task 04 (how native Node routing worked using `req.url` and `JSON.stringify`)
- Understanding why frameworks like Express reduce boilerplate code
- What JSON format looks like

## 4. Scenario / Problem Statement
In Task 04, handling routing with manual `if/else` statements, manual status codes, and manual `JSON.stringify()` calls quickly becomes tedious. Now, you will rewrite your backend server using **Express.js**—the industry-standard Node.js web framework. You will create clean routes for the root `/` and `/students`, returning JSON automatically.

## 5. Learning Objective
By completing this task, you will:
1. Import Express and instantiate an application with `express()`.
2. Define a root `GET /` route using `app.get()`.
3. Serve student records as JSON using Express's built-in `res.json()`.
4. Compare Express's concise syntax with native Node.js HTTP servers.

## 6. Setup and Execution Commands
From the repository root:
```bash
# Navigate to Task 05
cd tasks/05-express-basics

# Start the Express server
node server.js
```
Open your browser and test:
- [http://localhost:3000/](http://localhost:3000/)
- [http://localhost:3000/students](http://localhost:3000/students)

## 7. Step-by-Step Requirements
1. Open [server.js](file:///tasks/05-express-basics/server.js).
2. Follow the `TODO` markers:
   - Require express: `const express = require('express');`.
   - Initialize the app: `const app = express();`.
   - Define a `GET /` route that returns `"Welcome to Express Student Management API"` via `res.send()`.
   - Define a `GET /students` route that returns the `students` array using `res.json(students)`.
   - Set up `app.listen(PORT, ...)` inside `if (require.main === module)`.
   - Export `app` using `module.exports = app;`.

## 8. Files Students Are Expected to Modify
- [server.js](file:///tasks/05-express-basics/server.js)

## 9. API Contract
| Method | Endpoint | Status | Content-Type | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | `200 OK` | `text/html` or `text/plain` | `"Welcome to Express Student Management API"` |
| `GET` | `/students` | `200 OK` | `application/json` | `[{"id": 1, "name": "Asha", "course": "CSE"}, {"id": 2, "name": "Rahul", "course": "CSE"}]` |

## 10. Expected Output & Acceptance Criteria
- Running `node server.js` logs `"Express server running on port 3000"`.
- `GET /` returns status 200 with the welcome text.
- `GET /students` returns status 200 and automatic `Content-Type: application/json; charset=utf-8`.
- Response data matches the initial array of students.

## 11. Test Instructions
From the repository root:
```bash
npm run test:05
```

## 12. Progressive Hints
- **Hint 1 (Level 1)**: In Express, creating an app is simply `const app = express();`.
- **Hint 2 (Level 2)**: Route definition syntax is:
  ```javascript
  app.get('/route-path', (req, res) => {
    // response logic
  });
  ```
- **Hint 3 (Level 3)**: Unlike native Node, you do NOT need `res.writeHead()` or `JSON.stringify()`. Express's `res.json(data)` automatically sets the header and formats the JSON for you!

## 13. Common Errors & Debugging Advice
- **Error**: `TypeError: app.get is not a function`
  - *Fix*: You probably wrote `const app = express;` without invoking the function `express()`.
- **Error**: `Cannot find module 'express'`
  - *Fix*: Run `npm install` in the root repository folder.

## 14. Extension Challenge (For Faster Students)
Add a `GET /info` route that returns a JSON object containing server status and author details:
`{ "status": "active", "lab": "Module 3", "instructor": "Skill Lab Team" }`.
