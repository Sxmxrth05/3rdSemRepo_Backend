# Module 3 Core Concepts: Backend Development with Node.js & Express

This document summarizes the core theoretical foundations of **Module 3** as outlined in the *Full Stack Development Skill Lab Manual*.

---

## 1. Introduction to Backend Development

A modern web application generally consists of two complementary halves:

| Dimension | Frontend | Backend |
| :--- | :--- | :--- |
| **Visible to User** | Yes (UI, forms, buttons, cards, menus) | No (runs behind the scenes on server) |
| **Primary Job** | Presentation, UI interaction, local animations | Business logic, calculations, database access, security |
| **Technologies** | HTML5, CSS3, JavaScript, React, Angular | Node.js, Express.js, databases (MongoDB, PostgreSQL) |
| **Execution Environment** | Client browser (Chrome, Edge, Firefox) | Server environment (Node.js runtime on Linux/Windows/Cloud) |

### Server-Side Programming
Server-side programming refers to code that runs on the server rather than in the user's browser. The server receives requests from clients over the network, processes them, accesses databases or external APIs if needed, and returns an appropriate response.

### Client–Server Communication Cycle
1. **Client**: A program or device that requests services or resources (e.g., a web browser, a mobile app, or Postman).
2. **HTTP Request**: The client sends a structured network message containing:
   - **Method / Verb**: `GET`, `POST`, `PUT`, `DELETE`
   - **URL / Path**: e.g., `/students`, `/students/2`
   - **Headers**: Metadata (e.g., `Content-Type: application/json`)
   - **Body**: Optional payload with data to create or update.
3. **Server**: Listens on a designated **Port** (e.g., `3000`), receives the request, runs application logic, and returns an **HTTP Response**.
4. **HTTP Response**: The message returned to the client containing:
   - **Status Code**: A 3-digit number indicating result (e.g., `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Server Error`).
   - **Headers**: Response metadata (e.g., `Content-Type: application/json`).
   - **Response Body**: The payload data (usually in JSON format).

```text
[ Client (Browser / Postman) ]
            │
            │  1. HTTP Request (Method: GET, URL: /students)
            ▼
[ Node.js + Express HTTP Server (:3000) ]
            │
            │  2. Business Logic & In-Memory Store
            ▼
[ Response Generator ]
            │
            │  3. HTTP Response (Status: 200 OK, Body: JSON array)
            ▼
[ Client (Browser / Postman) ]
```

---

## 2. Node.js Fundamentals

**Node.js** is an open-source, cross-platform JavaScript runtime environment built on Chrome's V8 engine that allows JavaScript to run *outside* the web browser.

### Key Characteristics:
- **JavaScript on the Server**: Allows using a single programming language across both frontend and backend.
- **Fast and Efficient**: V8 compiles JavaScript directly into native machine code.
- **Event-Driven**: Uses an event loop to handle concurrent connections efficiently.
- **Non-blocking I/O**: Operations such as reading files, querying databases, and network requests do not freeze the single execution thread.

---

## 3. npm and `package.json`

**npm (Node Package Manager)** is the default package manager and registry for Node.js.

### Essential Commands:
- `npm init -y`: Initializes a new Node.js project and generates a default `package.json`.
- `npm install <package>`: Downloads a package from npm registry and saves it in `node_modules/` while adding it to `package.json`.
- `npm uninstall <package>`: Removes an installed package.
- `npm update`: Updates installed packages to compatible newer versions.

### Anatomy of `package.json`:
- `name`: Package identifier (lowercase, no spaces).
- `version`: Semantic version (e.g., `1.0.0`).
- `main`: Entry point file of the application (e.g., `server.js`).
- `scripts`: Custom CLI commands (e.g., `"start": "node server.js"`, `"test": "node --test"`).
- `dependencies`: Libraries required in production (e.g., `express`).
- `devDependencies`: Libraries used only during development and testing (e.g., `supertest`).

---

## 4. Node.js Modules

A **module** is a reusable unit of code that encapsulates specific functionality. Modules make programs modular, readable, and maintainable.

### Three Types of Modules:
1. **Built-in Modules**: Bundled directly with Node.js. No installation needed.
   - `http`: Web server creation and HTTP networking.
   - `fs`: File system reading and writing.
   - `path`: Cross-platform file path resolution.
   - `os`: Operating system information.
2. **User-defined Modules**: Files created by the developer using CommonJS syntax:
   - Exporting: `module.exports = { add, subtract };`
   - Importing: `const math = require('./math');`
3. **External Modules**: Packages installed from npm (e.g., `express`).

---

## 5. HTTP Methods and CRUD Operations

REST (Representational State Transfer) maps standard HTTP methods to CRUD (Create, Read, Update, Delete) operations on resources:

| HTTP Method | CRUD Operation | Purpose | Typical Status Code | Example Endpoint |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | **Read** | Retrieve existing data | `200 OK` | `GET /students` |
| **GET** | **Read** | Retrieve a single record | `200 OK` or `404 Not Found` | `GET /students/2` |
| **POST** | **Create** | Create a new record | `201 Created` or `400 Bad Request` | `POST /students` |
| **PUT** | **Update** | Update an existing record | `200 OK` or `404 Not Found` | `PUT /students/2` |
| **DELETE** | **Delete** | Remove an existing record | `200 OK` or `404 Not Found` | `DELETE /students/2` |

### Key HTTP Status Codes:
- **`200 OK`**: The request succeeded.
- **`201 Created`**: A new resource was successfully created.
- **`400 Bad Request`**: Client sent invalid or incomplete data (e.g., missing required fields).
- **`404 Not Found`**: The requested URL or resource ID does not exist.
- **`500 Internal Server Error`**: An unexpected exception occurred on the server.

---

## 6. Express.js Fundamentals

**Express.js** is a fast, minimalist, and unopinionated web framework for Node.js. It simplifies HTTP server development by providing:
- Simple, readable route definitions (`app.get()`, `app.post()`, `app.put()`, `app.delete()`).
- Middleware support for inspecting and transforming requests.
- Easy URL parameter extraction (`req.params.id`).
- Query string extraction (`req.query.search`).
- Built-in JSON response formatting (`res.json()`).

### The Role of `express.json()` Middleware
When a client sends a `POST` or `PUT` request with a JSON payload, Node.js streams raw bytes. Without middleware, `req.body` is `undefined`.
Calling:
```javascript
app.use(express.json());
```
tells Express to automatically parse incoming JSON payloads and populate `req.body` as a JavaScript object.

---

## 7. Storage in Module 3 vs Module 4

- **Module 3 (Current)**: Uses an **in-memory JavaScript array** (e.g., `let students = [...]`).
  - *Advantage*: Zero database setup; lets you focus entirely on HTTP verbs, routing, and REST semantics.
  - *Limitation*: When the Node.js server restarts, any newly added or modified students reset back to the initial list.
- **Module 4 (Next)**: Replaces the in-memory array with **MongoDB** (database persistence using collections and documents).
