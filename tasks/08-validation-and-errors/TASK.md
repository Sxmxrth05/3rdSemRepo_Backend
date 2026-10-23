# Task 08: Input Validation, Error Handling & Search

## 1. Task Number & Title
**Task 08**: Input Validation, Search Filtering, and Centralized Error Handling

## 2. Concepts Covered
- Input validation and defensive programming in backend APIs
- Differentiating HTTP status codes:
  - `400 Bad Request` for client payload errors (missing fields, blank strings)
  - `404 Not Found` for missing resources or invalid routes
  - `500 Internal Server Error` for uncaught runtime exceptions
- Query string parameters (`req.query.search`) for filtering data
- Case-insensitive searching across student records
- Fallback route handling for unmatched endpoints
- Express 4-argument error-handling middleware `(err, req, res, next)`

## 3. What Students Should Understand Before Starting
- Completion of Task 06 (CRUD operations) and Task 07 (Postman error testing)
- String methods: `.trim()`, `.toLowerCase()`, `.includes()`
- How URL query strings work (`/students?search=Asha`)

## 4. Scenario / Problem Statement
In real production APIs, clients frequently send invalid, malformed, or incomplete data (such as a POST request with an empty body, or missing required fields). A professional backend must never crash or silently accept corrupt data; it must validate inputs, return helpful error messages with status `400 Bad Request`, support search filtering via query parameters, and handle unmapped routes cleanly with status `404`.

## 5. Learning Objective
By completing this task, you will:
1. Validate required fields (`name` and `course`) in `POST` requests and return `400 Bad Request` if missing.
2. Implement search query filtering on `GET /students?search=term`.
3. Handle non-existent student IDs consistently with `404 Not Found`.
4. Implement a catch-all 404 middleware for unknown API routes.
5. Implement a centralized Express error-handling middleware.

## 6. Setup and Execution Commands
From the repository root:
```bash
# Navigate to Task 08
cd tasks/08-validation-and-errors

# Start the server
node server.js
```
Open Postman or your browser and test:
- Query filter: `http://localhost:3000/students?search=asha`
- Missing field validation: Send `POST http://localhost:3000/students` with body `{ "course": "CSE" }`
- Unknown route: `http://localhost:3000/api/unknown`

## 7. Step-by-Step Requirements
1. Open [server.js](file:///tasks/08-validation-and-errors/server.js).
2. Follow the `TODO` markers:
   - **`GET /students` (Search & List)**:
     - Check if `req.query.search` exists.
     - If provided, filter students case-insensitively by `name` or `course`.
     - Return the filtered results (or the full list if no search query is passed).
   - **`POST /students` (Validation)**:
     - Check that `name` and `course` are provided and not empty strings after `.trim()`.
     - If either is missing, return `res.status(400).json({ error: "Name and course are required fields" })`.
     - If valid, assign an auto-generated ID, add to `students`, and return `201 Created`.
   - **`PUT /students/:id` (Validation & Not Found)**:
     - Find the student by ID. If not found, return `404 Not Found`.
     - Check if neither `name` nor `course` was supplied. If body is completely empty, return `400 Bad Request`.
     - Update provided fields and return `200 OK`.
   - **404 Catch-All Middleware**:
     - At the very bottom of the route stack, add a middleware using `app.use((req, res) => { ... })` that returns `404 Not Found` with `{ error: "Route not found" }`.
   - **500 Error Middleware**:
     - Add error middleware `app.use((err, req, res, next) => { ... })` returning `500` with `{ error: "Internal server error" }`.

## 8. Files Students Are Expected to Modify
- [server.js](file:///tasks/08-validation-and-errors/server.js)

## 9. API Contract
| Method | Endpoint | Query / Body | Expected Status | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/students` | None | `200 OK` | All students array |
| `GET` | `/students?search=term` | Query param | `200 OK` | Filtered students array |
| `POST` | `/students` | Missing `name` or `course` | `400 Bad Request` | `{ "error": "Name and course are required fields" }` |
| `POST` | `/students` | Valid `{ "name": "Riya", "course": "CSE" }` | `201 Created` | Created student object |
| `PUT` | `/students/:id` | Invalid ID or Empty body | `404` or `400` | `{ "error": "..." }` |
| `ANY` | `/unregistered-path` | None | `404 Not Found` | `{ "error": "Route not found" }` |

## 10. Expected Output & Acceptance Criteria
- `POST` with empty body or missing fields returns status `400`.
- `GET /students?search=asha` returns only students matching "asha" (case-insensitive).
- Requests to unmapped paths return JSON with status `404`.
- The application never crashes due to bad user input.

## 11. Test Instructions
From the repository root:
```bash
npm run test:08
```

## 12. Progressive Hints
- **Hint 1 (Level 1)**: For search filtering, use `const term = req.query.search.toLowerCase();` and filter with `student.name.toLowerCase().includes(term)`.
- **Hint 2 (Level 2)**: For validation, test both existence and non-empty string:
  ```javascript
  if (!name || typeof name !== 'string' || !name.trim()) { ... }
  ```
- **Hint 3 (Level 3)**: Place the catch-all `app.use((req, res) => ...)` **after** all route handlers. If you place it at the top, it will intercept all requests before they reach your routes!

## 13. Common Errors & Debugging Advice
- **Error**: Search crashes when student name is undefined.
  - *Fix*: Guard with `(student.name || '').toLowerCase()`.
- **Error**: All routes return `404 Route not found`.
  - *Fix*: You placed the 404 catch-all middleware before your `app.get()` routes. In Express, order matters!

## 14. Extension Challenge (For Faster Students)
Add validation for student name length: ensure name is at least 2 characters long, and reject numeric strings for course names. Return descriptive error messages.
