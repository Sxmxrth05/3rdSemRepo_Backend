# Skill Lab Module 3: Backend Development with Node.js & Express

Welcome to the hands-on laboratory repository for **Module 3: Backend Development with Node.js and Express** of the Full Stack Development Skill Lab curriculum.

This repository is designed for college engineering students (3rd Semester CSE) participating in a 1-day, 6–7 hour intensive hands-on workshop. Through progressive scaffolding, students build their foundational understanding of server-side programming, HTTP architecture, Node.js modules, Express routing, input validation, and API testing—culminating in a complete **Student Management REST API**.

---

## 📑 Table of Contents
1. [What You Will Build](#1-what-you-will-build)
2. [Learning Objectives](#2-learning-objectives)
3. [Prerequisites & Software Installation](#3-prerequisites--software-installation)
4. [Clone and Setup Instructions](#4-clone-and-setup-instructions)
5. [Task Progression & Schedule](#5-task-progression--schedule)
6. [How to Run Each Exercise](#6-how-to-run-each-exercise)
7. [Running Automated Tests](#7-running-automated-tests)
8. [Importing & Using Postman](#8-importing--using-postman)
9. [Student Management API Contract](#9-student-management-api-contract)
10. [Troubleshooting Common Issues](#10-troubleshooting-common-issues)
11. [Workshop Completion Checklist](#11-workshop-completion-checklist)
12. [Instructor Guide & Reference Solutions](#12-instructor-guide--reference-solutions)

---

## 1. What You Will Build

By the end of this lab, you will build and test a fully functional **Student Management REST API** supporting complete CRUD operations:

```text
[ Browser / Postman ]
        │
        │ HTTP Request (GET, POST, PUT, DELETE)
        ▼
┌────────────────────────────────────────────────────────┐
│ Express.js Server (:3000)                              │
│ ├── Middleware: express.json()                         │
│ ├── Input Validation (400 Bad Request)                 │
│ ├── Query Filtering: ?search=...                       │
│ ├── In-Memory Student Store (Array of Objects)         │
│ └── Centralized Error & 404 Catch-All Handling        │
└────────────────────────────────────────────────────────┘
        │
        ▼ HTTP Response (200, 201, 400, 404)
[ Client Receives JSON Payload ]
```

> [!NOTE]
> In Module 3, data is maintained in an in-memory JavaScript array to master HTTP verbs, status codes, and routing without database complexity. In **Module 4**, this in-memory store is replaced with **MongoDB**.

---

## 2. Learning Objectives

By working through this repository, you will:
- Understand client–server architecture and the request–response cycle.
- Execute JavaScript on the server using the **Node.js runtime environment**.
- Manage project dependencies and scripts using **npm** and `package.json`.
- Export and import functions across files using **CommonJS modules** (`require` / `module.exports`) and utilize built-in modules (`os`, `path`, `http`).
- Construct a native HTTP server and implement basic URL routing with status codes.
- Transition to **Express.js** to build structured REST APIs with minimal boilerplate.
- Parse JSON request bodies using `express.json()`.
- Implement full CRUD operations:
  - `GET /students` (retrieve all students with search query filtering)
  - `GET /students/:id` (retrieve a single student by ID)
  - `POST /students` (create a student with input validation and auto-generated ID)
  - `PUT /students/:id` (update existing student fields)
  - `DELETE /students/:id` (delete a student from memory)
- Test APIs, status codes, and error conditions manually using **Postman**.
- Validate inputs and handle edge cases (`400 Bad Request`, `404 Not Found`).

---

## 3. Prerequisites & Software Installation

Ensure the following tools are installed on your machine:

| Software | Minimum Version | Installation Check | Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` or higher | `node -v` | [nodejs.org](https://nodejs.org/) |
| **npm** | `v9.0.0` or higher | `npm -v` | Bundled with Node.js |
| **VS Code** | Latest | `code -v` | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Postman** | Latest Desktop App | Open Application | [postman.com/downloads](https://www.postman.com/downloads/) |
| **Git** | `v2.30.0` or higher | `git --version` | [git-scm.com](https://git-scm.com/) |

Detailed installation guidance is available in [docs/setup.md](file:///docs/setup.md).

---

## 4. Clone and Setup Instructions

### Step 1: Clone the Repository
```bash
git clone https://github.com/Sxmxrth05/3rdSemRepo_Backend.git
cd 3rdSemRepo_Backend
```

### Step 2: Install Project Dependencies
Run this once from the root directory to install development and testing dependencies:
```bash
npm install
```

---

## 5. Task Progression & Schedule

The workshop follows progressive scaffolding. Earlier tasks provide guided walk-throughs; intermediate tasks contain starter code with `TODO` markers; the capstone challenge is implemented independently.

| Task # | Folder | Estimated Time | Focus Area |
| :---: | :--- | :---: | :--- |
| **01** | [tasks/01-nodejs-and-npm/](file:///tasks/01-nodejs-and-npm/TASK.md) | 30 mins | Running Node.js, `process` globals, `npm init`, `package.json` |
| **02** | [tasks/02-modules/](file:///tasks/02-modules/TASK.md) | 35 mins | CommonJS `module.exports`, `require()`, `os`, and `path` modules |
| **03** | [tasks/03-http-server/](file:///tasks/03-http-server/TASK.md) | 35 mins | Native `http.createServer()`, request listener, port 3000, `res.end()` |
| **04** | [tasks/04-http-routing/](file:///tasks/04-http-routing/TASK.md) | 45 mins | Native URL routing (`/`, `/about`, `/students`), 404 status codes |
| **05** | [tasks/05-express-basics/](file:///tasks/05-express-basics/TASK.md) | 40 mins | Express application setup, `app.get()`, `res.json()` responses |
| **06** | [tasks/06-rest-and-crud/](file:///tasks/06-rest-and-crud/TASK.md) | 60 mins | Full CRUD (`GET`, `POST`, `PUT`, `DELETE`), in-memory array |
| **07** | [tasks/07-postman-testing/](file:///tasks/07-postman-testing/TASK.md) | 45 mins | Postman collections, sending payloads, testing status codes |
| **08** | [tasks/08-validation-and-errors/](file:///tasks/08-validation-and-errors/TASK.md) | 45 mins | Input validation (400), non-existent IDs (404), `?search=` query |
| **09** | [tasks/09-final-challenge/](file:///tasks/09-final-challenge/TASK.md) | 75 mins | **Capstone**: Independent Student Management REST API build |

*Total Workshop Active Coding Time: ~6.5 Hours (fits 1-day lab schedule).*

---

## 6. How to Run Each Exercise

Each task folder is self-contained. Navigate to the task directory to run and test it:

```bash
# Task 01: Node.js & npm
node tasks/01-nodejs-and-npm/app.js

# Task 02: Modules
node tasks/02-modules/app.js

# Task 03: Native HTTP Server
node tasks/03-http-server/server.js

# Task 04: Native HTTP Routing
node tasks/04-http-routing/server.js

# Task 05: Express Basics
node tasks/05-express-basics/server.js

# Task 06: REST and CRUD Operations
node tasks/06-rest-and-crud/server.js

# Task 08: Validation & Errors
node tasks/08-validation-and-errors/server.js

# Task 09: Final Capstone API Challenge
node tasks/09-final-challenge/server.js
```

---

## 7. Running Automated Tests

You can check whether your implementations pass automated unit and integration tests at any time from the repository root:

```bash
# Run all automated tests
npm test

# Run tests for a specific task
npm run test:03
npm run test:04
npm run test:05
npm run test:06
npm run test:08
npm run test:09
```

---

## 8. Importing & Using Postman

1. Open Postman.
2. Click **Import** in the upper left.
3. Import both files from the [postman/](file:///postman/) directory:
   - `postman/Module3_Student_Management_API.postman_collection.json`
   - `postman/Module3_Dev_Environment.postman_environment.json`
4. Select the environment **Module 3 - Local Dev** from the top-right environment selector.
5. Start your server (`node tasks/09-final-challenge/server.js`), then send requests in the collection:
   - `GET /students`
   - `POST /students`
   - `PUT /students/:id`
   - `DELETE /students/:id`
   - `GET /students?search=Asha`
   - Negative tests: Missing fields (400) and Invalid ID (404)

See [tasks/07-postman-testing/guide.md](file:///tasks/07-postman-testing/guide.md) for full screenshots and detailed instructions.

---

## 9. Student Management API Contract

| Method | Endpoint | Request Body | Success Status | Error Status | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/students` | None | `200 OK` | `500` | List all students (supports `?search=term`) |
| `GET` | `/students/:id` | None | `200 OK` | `404 Not Found` | Retrieve student by integer ID |
| `POST` | `/students` | `{ "name": "Riya", "course": "CSE" }` | `201 Created` | `400 Bad Request` | Create student (auto-generates unique `id`) |
| `PUT` | `/students/:id` | `{ "course": "ISE" }` | `200 OK` | `400 / 404` | Update existing student |
| `DELETE` | `/students/:id` | None | `200 OK` | `404 Not Found` | Delete student by integer ID |
| `ANY` | `/*` | Any | — | `404 Not Found` | Catch-all for unmapped URLs |

---

## 10. Troubleshooting Common Issues

| Issue / Error | Likely Cause | Solution |
| :--- | :--- | :--- |
| `EADDRINUSE: address already in use :::3000` | Another process is already running on port 3000 | Kill the old terminal with `Ctrl+C`, or see [docs/troubleshooting.md](file:///docs/troubleshooting.md) |
| `Cannot find module 'express'` | Dependencies not installed | Run `npm install` from repository root |
| `req.body` is `undefined` | Missing JSON body parsing middleware | Add `app.use(express.json());` before your routes |
| `1 === "1"` evaluates to `false` | Route param is a string, array stores numbers | Use `parseInt(req.params.id, 10)` |
| Postman request hangs indefinitely | Missing `res.json()` or `res.end()` | Make sure every `if` and `else` branch sends a response |

Full troubleshooting tips are documented in [docs/troubleshooting.md](file:///docs/troubleshooting.md).

---

## 11. Workshop Completion Checklist

Before leaving the lab, ensure you have checked off the following deliverables:
- [ ] Successfully initialized and executed Node.js programs using `npm start`.
- [ ] Exported and imported custom utility functions using CommonJS modules.
- [ ] Created a native HTTP server and implemented URL-based routing.
- [ ] Created an Express application and served JSON data.
- [ ] Implemented full in-memory CRUD operations (`GET`, `POST`, `PUT`, `DELETE`).
- [ ] Validated all endpoints in Postman and recorded status codes.
- [ ] Completed the Capstone Student Management API with input validation and search.
- [ ] Ran `npm test` and verified that all automated tests pass.
- [ ] Committed all your work to Git with meaningful commit messages.

---

## 12. Instructor Guide & Reference Solutions

For instructors and teaching assistants:
- Complete reference implementations are maintained in the [solutions/](file:///solutions/) folder.
- Run `npm run test:solutions` to verify all reference implementations against the automated test suites.
- Read [solutions/README.md](file:///solutions/README.md) for curriculum delivery suggestions, design decisions, and classroom tips.
