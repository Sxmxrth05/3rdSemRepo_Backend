# Step-by-Step Postman Testing Guide

This guide provides a detailed walkthrough for testing your Student Management API using Postman, matching the figures in the Skill Lab Manual (Section 4).

---

## Part 1: Setting up the Request in Postman

When creating or inspecting an HTTP request in Postman, configure the 4 core components:

```text
┌─────────────────────────────────────────────────────────────┐
│ [Method Dropdown: POST]  [URL: {{baseUrl}}/students] [Send] │
├─────────────────────────────────────────────────────────────┤
│ Params | Authorization | Headers (1) | Body (*) | Tests     │
│  (•) raw       [ JSON ▾ ]                                   │
│  {                                                          │
│    "name": "Riya",                                          │
│    "course": "CSE"                                          │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

1. **Method Selector**: Click the dropdown next to the URL input. Choose `GET`, `POST`, `PUT`, or `DELETE`.
2. **URL Bar**: Enter `{{baseUrl}}/students` (which resolves to `http://localhost:3000/students`).
3. **Headers Tab**: Ensure `Content-Type: application/json` is present when sending a body.
4. **Body Tab (for POST and PUT)**:
   - Select the **raw** radio button.
   - Click the format dropdown and choose **JSON** (do NOT leave it as Text).
   - Enter your JSON payload.

---

## Part 2: Inspecting the Response

After clicking the blue **Send** button, inspect the bottom panel:

```text
┌─────────────────────────────────────────────────────────────┐
│ Status: 201 Created   Time: 12 ms   Size: 180 B             │
├─────────────────────────────────────────────────────────────┤
│ Pretty | Raw | Preview   [ JSON ▾ ]                         │
│ {                                                           │
│   "id": 3,                                                  │
│   "name": "Riya",                                           │
│   "course": "CSE"                                           │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
```

1. **Status Code**:
   - `200 OK`: Request succeeded for GET, PUT, or DELETE.
   - `201 Created`: Resource successfully created via POST.
   - `400 Bad Request`: Input validation failed (missing name or course).
   - `404 Not Found`: Student ID or URL does not exist.
2. **Time**: Shows server latency in milliseconds.
3. **Body**: The JSON returned by Express's `res.json()`.

---

## Part 3: Verification Checklist

Fill out this checklist during your lab session:

| Test Case | Expected Status | Actual Status | Pass/Fail | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `GET /students` | `200 OK` | | | Initial list of 2 students |
| `GET /students/1` | `200 OK` | | | Returns Asha |
| `POST /students` | `201 Created` | | | Created Riya with ID 3 |
| `PUT /students/2` | `200 OK` | | | Updated Rahul's course to ISE |
| `DELETE /students/1` | `200 OK` | | | Deleted student 1 |
| `GET /students/1` | `404 Not Found` | | | Confirms student 1 is gone |
| `GET /students/999` | `404 Not Found` | | | Non-existent student test |
| `POST /students (no name)` | `400 Bad Request` | | | Validation error test |
