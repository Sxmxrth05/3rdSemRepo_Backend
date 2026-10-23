# Postman Testing Guide & Collection Setup

This folder contains the complete Postman collection and development environment for **Module 3: Student Management REST API**.

---

## 1. Files in this Directory

- `Module3_Student_Management_API.postman_collection.json`: Complete collection containing 9 organized requests (CRUD, search query, 400 validation errors, and 404 missing resource handling).
- `Module3_Dev_Environment.postman_environment.json`: Postman environment setting `baseUrl = http://localhost:3000`.

---

## 2. How to Import into Postman

1. Open the **Postman** desktop app.
2. Click the **Import** button in the top-left corner of the sidebar.
3. Drag and drop both JSON files from this folder (`postman/`):
   - `Module3_Student_Management_API.postman_collection.json`
   - `Module3_Dev_Environment.postman_environment.json`
4. In the top-right corner of Postman, open the environment dropdown (which default says "No Environment") and select **"Module 3 - Local Dev"**.

---

## 3. Running Requests

1. Make sure your server is running in your terminal:
   ```bash
   node tasks/06-rest-and-crud/server.js
   # or
   node tasks/08-validation-and-errors/server.js
   # or
   node tasks/09-final-challenge/server.js
   ```
2. In Postman, open the **Module 3: Student Management REST API** collection.
3. Test requests in the following sequence:
   - **GET All Students**: Verify status `200 OK` and inspect the list.
   - **GET Single Student by ID (Valid)**: Verify status `200 OK` and student with `id: 1`.
   - **POST Create New Student**: Inspect raw JSON body, click **Send**, verify status `201 Created` and returned `id: 3`.
   - **PUT Update Student by ID**: Send updated course, verify status `200 OK`.
   - **DELETE Student by ID**: Send request, verify status `200 OK`. Re-run **GET All Students** to confirm it was removed.
   - **GET Student with Non-Existent ID (404)**: Verify status `404 Not Found`.
   - **POST Create Student - Missing Name (400)**: Verify status `400 Bad Request`.
