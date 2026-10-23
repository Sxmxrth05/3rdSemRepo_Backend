# Task 06: RESTful APIs & CRUD Operations

## 1. Task Number & Title
**Task 06**: Building a Complete In-Memory Student Management REST API (CRUD)

## 2. Concepts Covered
- REST architectural principles (resources, statelessness, standard HTTP verbs)
- Mapping CRUD operations to HTTP methods:
  - **C**reate -> `POST /students`
  - **R**ead -> `GET /students` and `GET /students/:id`
  - **U**pdate -> `PUT /students/:id`
  - **D**elete -> `DELETE /students/:id`
- Parsing JSON request bodies via `app.use(express.json())` middleware
- Extracting route parameters with `req.params.id`
- Handling missing records with HTTP status `404 Not Found`
- Signifying successful creation with HTTP status `201 Created`

## 3. What Students Should Understand Before Starting
- Completion of Task 05 (creating an Express app and returning JSON)
- JavaScript array methods: `.find()`, `.findIndex()`, `.push()`, `.splice()`, `.map()`
- Converting string parameters to numbers using `parseInt(req.params.id, 10)`

## 4. Scenario / Problem Statement
As specified in Section 3 of the Skill Lab Manual (Table 5 & Figure 4), you are building the backend core for the **Student Management System**. Client applications (such as frontend dashboards or Postman) need to perform full lifecycle operations on student records: viewing all students, viewing a single student by ID, adding a new student, updating an existing student, and deleting a student. For now, data is stored in memory; it will transition to MongoDB in Module 4.

## 5. Learning Objective
By completing this task, you will:
1. Register `express.json()` middleware to parse incoming request payloads.
2. Implement `GET /students` to return the complete student collection.
3. Implement `GET /students/:id` to retrieve a single student, returning `404` if not found.
4. Implement `POST /students` to create a new student, auto-generate a unique `id`, and return `201 Created`.
5. Implement `PUT /students/:id` to update student fields and return the updated record.
6. Implement `DELETE /students/:id` to remove a student from the in-memory array.

## 6. Setup and Execution Commands
From the repository root:
```bash
# Navigate to Task 06
cd tasks/06-rest-and-crud

# Start the server
node server.js
```
The server will listen at `http://localhost:3000`.

## 7. Step-by-Step Requirements
1. Open [server.js](file:///tasks/06-rest-and-crud/server.js).
2. Ensure `app.use(express.json());` is enabled so `req.body` is parsed.
3. Review the starter `students` array:
   ```javascript
   let students = [
     { id: 1, name: "Asha", course: "CSE" },
     { id: 2, name: "Rahul", course: "CSE" }
   ];
   ```
4. Complete the route handlers:
   - **`GET /students`**: Return the `students` array as JSON (`res.json(students)`).
   - **`GET /students/:id`**:
     - Parse ID: `const id = parseInt(req.params.id, 10);`.
     - Find student using `students.find(s => s.id === id)`.
     - If not found, return `res.status(404).json({ error: "Student not found" })`.
     - If found, return `res.json(student)`.
   - **`POST /students`**:
     - Extract `name` and `course` from `req.body`.
     - Generate a new `id` (e.g., `students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1`).
     - Create new student object `{ id, name, course }`.
     - Push to `students` array.
     - Return status `201` with the new student (`res.status(201).json(newStudent)`).
   - **`PUT /students/:id`**:
     - Find the student by ID. If not found, return `404`.
     - Update fields: `student.name = req.body.name || student.name;` and `student.course = req.body.course || student.course;`.
     - Return status `200` with the updated student (`res.json(student)`).
   - **`DELETE /students/:id`**:
     - Find index: `const index = students.findIndex(s => s.id === id);`.
     - If index is `-1`, return `404`.
     - Remove using `students.splice(index, 1);`.
     - Return `res.json({ message: "Student deleted successfully" })`.

## 8. Files Students Are Expected to Modify
- [server.js](file:///tasks/06-rest-and-crud/server.js)

## 9. API Contract
| Method | Endpoint | Request Body | Status Code | Response Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/students` | None | `200 OK` | Array of student objects |
| `GET` | `/students/:id` | None | `200 OK` / `404 Not Found` | Single student object or `{ error: "..." }` |
| `POST` | `/students` | `{ "name": "Riya", "course": "CSE" }` | `201 Created` | Newly created student with `id` |
| `PUT` | `/students/:id` | `{ "course": "ECE" }` | `200 OK` / `404 Not Found` | Updated student object or `{ error: "..." }` |
| `DELETE` | `/students/:id` | None | `200 OK` / `404 Not Found` | `{ message: "Student deleted successfully" }` |

## 10. Expected Output & Acceptance Criteria
- Full CRUD operations work correctly against the in-memory array.
- Status codes strictly follow REST conventions (`200` for reads/updates/deletions, `201` for creations, `404` for missing resources).
- Deletion removes the element from future `GET /students` requests.

## 11. Test Instructions
From the repository root:
```bash
npm run test:06
```

## 12. Progressive Hints
- **Hint 1 (Level 1)**: `req.params.id` is a string! `1 === "1"` is false. Always wrap with `parseInt(req.params.id, 10)` before searching the array.
- **Hint 2 (Level 2)**: For `POST`, don't forget `res.status(201).json(newStudent);`. Notice that `res.status(201)` sets the status code, and chaining `.json(...)` sends the body.
- **Hint 3 (Level 3)**: For `DELETE`, use `students.findIndex()`. If found, `students.splice(index, 1)` deletes exactly 1 element at that index.

## 13. Common Errors & Debugging Advice
- **Error**: `POST` body is undefined (`req.body.name` causes crash).
  - *Fix*: Ensure `app.use(express.json());` is placed before route definitions.
- **Error**: Updating student changes nothing.
  - *Fix*: Verify you accessed the found student reference and updated its properties before calling `res.json(student)`.

## 14. Extension Challenge (For Faster Students)
Support adding an optional `semester` number to the student object (e.g. `semester: 3`). When updating with `PUT`, preserve existing properties that weren't included in `req.body`.
