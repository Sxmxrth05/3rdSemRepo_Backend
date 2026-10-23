# Task 07: API Testing Using Postman

## 1. Task Number & Title
**Task 07**: Manual API Testing, Request Construction, and Response Inspection with Postman

## 2. Concepts Covered
- Role of manual API testing in backend engineering
- Structure of an API Request: Method, URL, Headers (`Content-Type`), Body (raw JSON)
- Inspecting Response Elements: Status Code, Response Headers, Response Time, Response Body
- Differentiating Success Status Codes (`200 OK`, `201 Created`) from Client Errors (`400 Bad Request`, `404 Not Found`)
- Using Postman Collections and Environment Variables (`{{baseUrl}}`)

## 3. What Students Should Understand Before Starting
- Completion of Task 06 (running the CRUD Express server)
- Having Postman Desktop installed on your system

## 4. Scenario / Problem Statement
As highlighted in Section 4 of the Skill Lab Manual (Figures 5 & 6), backend developers cannot rely on web browsers alone to test APIs because browsers natively only send `GET` requests when you type a URL. You will import the official Postman collection, execute all CRUD operations against your running Express server, inspect status codes, and test failure conditions.

## 5. Learning Objective
By completing this task, you will:
1. Import a Postman Collection and Environment file.
2. Formulate `GET`, `POST`, `PUT`, and `DELETE` requests in Postman.
3. Supply JSON request payloads using `Body -> raw -> JSON`.
4. Inspect and evaluate response status codes and JSON payloads.
5. Identify and trigger intentional error responses (`404 Not Found` for invalid IDs, `400 Bad Request` for missing data).

## 6. Setup and Execution Commands
1. Start your CRUD server from Task 06 (or Task 08):
   ```bash
   node tasks/06-rest-and-crud/server.js
   ```
2. Open Postman.
3. Import the collection file from [postman/Module3_Student_Management_API.postman_collection.json](file:///postman/Module3_Student_Management_API.postman_collection.json).
4. Import the environment file from [postman/Module3_Dev_Environment.postman_environment.json](file:///postman/Module3_Dev_Environment.postman_environment.json).
5. Select the **Module 3 - Local Dev** environment in Postman.

## 7. Step-by-Step Requirements
1. Follow the interactive walkthrough in [guide.md](file:///tasks/07-postman-testing/guide.md).
2. Execute **Request 1: GET All Students**:
   - Verify status code is `200 OK`.
   - Confirm the returned array contains Asha and Rahul.
3. Execute **Request 2: GET Single Student by ID (1)**:
   - Confirm status code is `200 OK` and student `id` is `1`.
4. Execute **Request 3: POST Create New Student**:
   - Inspect the request body: `{ "name": "Riya", "course": "CSE" }`.
   - Send the request. Confirm status code is `201 Created`.
   - Confirm the returned object includes auto-generated `"id": 3`.
5. Execute **Request 4: PUT Update Student by ID (2)**:
   - Body: `{ "course": "ISE" }`.
   - Confirm status code is `200 OK` and course is updated to `"ISE"`.
6. Execute **Request 5: DELETE Student by ID (1)**:
   - Send request. Confirm status code is `200 OK`.
   - Re-run **GET All Students** and confirm ID 1 is no longer in the list.
7. Execute **Request 6: GET Student with Non-Existent ID (999)**:
   - Confirm status code is `404 Not Found` with `{ "error": "Student not found" }`.

## 8. Files Students Are Expected to Modify
- *This is an interactive manual testing task. Students inspect server logs and record test results in [guide.md](file:///tasks/07-postman-testing/guide.md).*

## 9. API Contract
Refer to [postman/README.md](file:///postman/README.md) for the complete endpoint schema and status code table.

## 10. Expected Output & Acceptance Criteria
- [ ] Postman successfully communicates with `http://localhost:3000`.
- [ ] Every request in the collection produces the expected status code.
- [ ] Creation produces `201 Created` with a new `id`.
- [ ] Unknown IDs produce `404 Not Found`.

## 11. Test Instructions
Keep the server running and run the collection in Postman using the **Run Collection** runner button, or execute each request individually.

## 12. Progressive Hints
- **Hint 1 (Level 1)**: If requests fail with `Could not send request` or `ECONNREFUSED`, check your VS Code terminal to make sure your Node server is running on port 3000.
- **Hint 2 (Level 2)**: Ensure the Postman environment dropdown in the top-right shows `Module 3 - Local Dev`. If it says "No Environment", `{{baseUrl}}` won't resolve.
- **Hint 3 (Level 3)**: When sending a `POST` or `PUT`, make sure the dropdown next to `raw` says `JSON`, not `Text`.

## 13. Common Errors & Debugging Advice
- **Error**: `JSONError: Unexpected token in JSON at position...`
  - *Fix*: You missed a quotation mark or left a trailing comma in your Postman body.
- **Error**: Server crashes with `Cannot read property 'name' of undefined`
  - *Fix*: You forgot `app.use(express.json())` in the server.

## 14. Extension Challenge (For Faster Students)
In Postman, go to the **Tests** tab of the `POST Create New Student` request and write a JavaScript assertion:
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});
pm.test("Student has valid ID", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.be.a('number');
});
```
Click **Send** and watch the test pass in the **Test Results** tab!
