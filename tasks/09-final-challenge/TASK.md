# Task 09: Final Challenge - Student Management REST API

## 1. Task Number & Title
**Task 09 (Capstone Challenge)**: Independent Implementation of the Complete Student Management REST API

## 2. Concepts Covered
- Full-stack client–server REST API integration
- Complete CRUD implementation in Express.js
- In-memory data store manipulation and ID sequencing
- Robust input validation and error responses (`400 Bad Request`, `404 Not Found`)
- URL Query parameter search functionality
- 404 catch-all routing and 500 server error handling
- Postman validation and automated unit testing

## 3. What Students Should Understand Before Starting
- Completion of Tasks 01 through 08
- How to start an Express server on port 3000
- How to test endpoints using Postman and automated test scripts

## 4. Scenario / Problem Statement
It is the final session of the Skill Lab workshop. The college administration department has tasked you with delivering the complete, production-grade **Student Management REST API**. This API will serve as the official backend for student record management before being connected to MongoDB in Module 4. 

You are given a project skeleton with data definitions and route shells. You must independently implement all route logic, input validations, and error handlers to meet the strict API contract below.

## 5. Learning Objective
By completing this challenge, you will independently build, run, and verify a complete REST API that handles:
1. `GET /students` with query parameter filtering (`?search=...`).
2. `GET /students/:id` retrieving individual records with 404 detection.
3. `POST /students` validating inputs and auto-incrementing unique IDs.
4. `PUT /students/:id` updating existing records with validation.
5. `DELETE /students/:id` removing records from memory.
6. Unknown route handling returning `404 Not Found`.

## 6. Setup and Execution Commands
From the repository root:
```bash
# Navigate to the final challenge directory
cd tasks/09-final-challenge

# Run your server
npm start
# or: node server.js
```
The server will run at: `http://localhost:3000`.

## 7. Step-by-Step Requirements
Open [server.js](file:///tasks/09-final-challenge/server.js) and implement the following endpoints:

### Endpoint 1: `GET /students`
- If query parameter `search` is provided (`req.query.search`), filter the list by student `name` or `course` (case-insensitive).
- Return status `200 OK` with the matching student array (or full array if no query provided).

### Endpoint 2: `GET /students/:id`
- Parse ID as an integer using `parseInt(req.params.id, 10)`.
- If student exists, return status `200 OK` with the student object.
- If student does not exist, return status `404 Not Found` with `{ "error": "Student not found" }`.

### Endpoint 3: `POST /students`
- Validate that `req.body` contains `name` and `course` (both non-empty strings).
- If validation fails, return status `400 Bad Request` with `{ "error": "Name and course are required fields" }`.
- Generate a new unique ID: `Math.max(...students.map(s => s.id)) + 1` (or `1` if array is empty).
- Add new student `{ id, name: name.trim(), course: course.trim() }` to the array.
- Return status `201 Created` with the newly created student.

### Endpoint 4: `PUT /students/:id`
- Find student by integer ID. If not found, return status `404 Not Found`.
- Validate that at least one field (`name` or `course`) is supplied in `req.body`. If body is empty, return status `400 Bad Request`.
- Update the student's fields and return status `200 OK` with the updated student object.

### Endpoint 5: `DELETE /students/:id`
- Find student index by integer ID. If not found, return status `404 Not Found`.
- Remove student from the in-memory array using `.splice(index, 1)`.
- Return status `200 OK` with `{ "message": "Student deleted successfully" }`.

### Middleware: Catch-All 404 Route
- Place at the bottom of the routes: return status `404 Not Found` with `{ "error": "Route not found" }` for any unmatched requests.

## 8. Files Students Are Expected to Modify
- [server.js](file:///tasks/09-final-challenge/server.js)

## 9. API Contract Summary
| Method | Endpoint | Request Body | Success Status | Error Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/students` | None | `200 OK` | `500` |
| `GET` | `/students?search=term` | None | `200 OK` | `500` |
| `GET` | `/students/:id` | None | `200 OK` | `404 Not Found` |
| `POST` | `/students` | `{ "name": "Riya", "course": "CSE" }` | `201 Created` | `400 Bad Request` |
| `PUT` | `/students/:id` | `{ "course": "ISE" }` | `200 OK` | `400 Bad Request` / `404 Not Found` |
| `DELETE`| `/students/:id` | None | `200 OK` | `404 Not Found` |
| `ANY` | `/*` | Any | `404 Not Found` | |

## 10. Expected Output & Acceptance Criteria
- [ ] Server launches on port 3000 without errors.
- [ ] `GET /students` returns initial list of students.
- [ ] `GET /students?search=asha` filters case-insensitively.
- [ ] `POST /students` without name or course returns `400`.
- [ ] `POST /students` with valid JSON returns `201` and adds record.
- [ ] `PUT /students/:id` updates record and returns `200`.
- [ ] `DELETE /students/:id` removes record and returns `200`.
- [ ] Non-existent student queries/updates/deletions return `404`.
- [ ] Unregistered URLs return `404 Route not found`.

## 11. Test Instructions
From the repository root:
```bash
npm run test:09
```

## 12. Progressive Hints
- **Hint 1 (Level 1)**: Keep `server.js` clean by declaring routes in order: `GET`, `POST`, `PUT`, `DELETE`, and finally the `404` catch-all middleware.
- **Hint 2 (Level 2)**: When generating IDs, do not just use `students.length + 1` because if you delete student 1, length becomes 1, and the next added student would get ID 2 (which already exists!). Using `Math.max(...students.map(s => s.id)) + 1` guarantees uniqueness.
- **Hint 3 (Level 3)**: Remember to parse integer IDs: `const id = parseInt(req.params.id, 10);`.

## 13. Common Errors & Debugging Advice
- **Issue**: `req.body` is `undefined`.
  - *Fix*: Check that `app.use(express.json());` is at the top of the file before any routes.
- **Issue**: Postman says `404 Route not found` on all endpoints.
  - *Fix*: You defined `app.use((req, res) => ...)` before your route handlers. Move it to the bottom!

## 14. Extension Challenge (For Faster Students)
Add a query parameter for sorting: `GET /students?sortBy=name` which returns students sorted alphabetically by name.
