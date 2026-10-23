# Troubleshooting & Common Issues Guide

This guide lists the most frequent issues students encounter while working through **Module 3** exercises, along with immediate solutions.

---

## 1. Port Already in Use (`EADDRINUSE: address already in use :::3000`)

### Symptom:
```text
Error: listen EADDRINUSE: address already in use :::3000
    at Server.setupListenHandle [as _listen2] (node:net:1800:16)
```

### Cause:
Another terminal or background process is already running a server on port 3000.

### Solution:
1. **Find and close the old terminal**: Check your open VS Code terminal tabs and stop the running server by pressing `Ctrl + C`.
2. **Or kill the process using port 3000**:
   - **On Windows (PowerShell)**:
     ```powershell
     # Find PID on port 3000
     netstat -ano | findstr :3000
     # Kill PID (replace 12345 with the PID found)
     taskkill /PID 12345 /F
     ```
   - **Or change the port temporarily**:
     Change `const PORT = 3000;` to `const PORT = 3001;`.

---

## 2. `Cannot find module 'express'`

### Symptom:
```text
Error: Cannot find module 'express'
Require stack:
 - C:\...\tasks\05-express-basics\server.js
```

### Cause:
You ran `node server.js` from a folder where `node_modules` is not present, or dependencies were not installed.

### Solution:
Run `npm install` from the repository root:
```bash
cd "c:\path\to\3rdSemRepo_Backend"
npm install
```
Node.js automatically traverses parent directories until it finds the `node_modules` folder.

---

## 3. `req.body` is `undefined`

### Symptom:
When making a `POST` or `PUT` request with a JSON body in Postman, logging `req.body` outputs `undefined` or throws `TypeError: Cannot read properties of undefined (reading 'name')`.

### Cause:
You did not register the Express JSON body-parsing middleware.

### Solution:
Add this line near the top of your Express app, before defining any routes:
```javascript
app.use(express.json());
```

---

## 4. Postman Request Hangs Indefinitely

### Symptom:
Clicking **Send** in Postman shows "Sending request..." and the spinner spins endlessly without a response.

### Cause:
Your route handler received the request, but you forgot to send a response back (`res.end()`, `res.send()`, or `res.json()`).

### Solution:
Ensure every code branch (including `if` and `else`) returns a response:
```javascript
// ❌ WRONG: Missing response when student is not found
app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (student) {
    res.json(student);
  }
  // If not found, execution ends here without responding!
});

// ✅ CORRECT:
app.get('/students/:id', (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }
  res.json(student);
});
```

---

## 5. `GET /students/:id` Always Returns `404 Not Found`

### Symptom:
You request `GET /students/1`, but the server says the student is not found, even though student ID 1 is in your array.

### Cause:
`req.params.id` is always a **string** (`"1"`). If your array stores numeric IDs (`id: 1`), strict equality `1 === "1"` evaluates to `false`!

### Solution:
Always convert URL parameter IDs to integers:
```javascript
const id = parseInt(req.params.id, 10);
const student = students.find(s => s.id === id);
```

---

## 6. Postman Returns `400 Bad Request: Unexpected token`

### Symptom:
```json
{
  "error": "Unexpected token in JSON at position..."
}
```

### Cause:
The JSON in your Postman Request Body is invalid. Common mistakes:
- Missing double quotes around keys (`{ name: "Asha" }` instead of `{ "name": "Asha" }`).
- Trailing commas after the last field (`{ "name": "Asha", }`).
- Using single quotes (`{ 'name': 'Asha' }`).

### Solution:
JSON requires strict double quotes:
```json
{
  "name": "Asha",
  "course": "CSE"
}
```

---

## 7. Postman Sends Plain Text Instead of JSON

### Symptom:
`req.body` is empty `{}` even though you typed data in Postman.

### Cause:
In Postman, under the **Body** tab, you selected `raw` but the format dropdown remained set to `Text` instead of `JSON`.

### Solution:
In Postman:
1. Go to the **Body** tab.
2. Select **raw**.
3. In the dropdown to the right of "raw", change **Text** to **JSON**.
4. Notice that Postman automatically adds the header `Content-Type: application/json`.

---

## 8. Git: `fatal: not a git repository` or Unsaved Changes

### Symptom:
Running `git status` fails or you cannot switch branches.

### Solution:
- Always ensure your terminal prompt is at the repository root (`cd 3rdSemRepo_Backend`).
- Check status before switching tasks:
  ```bash
  git status
  git add .
  git commit -m "Complete task X"
  ```
