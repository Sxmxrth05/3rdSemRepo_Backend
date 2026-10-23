# Task 01: Node.js Fundamentals & npm

## 1. Task Number & Title
**Task 01**: Node.js Fundamentals and Project Initialization with npm

## 2. Concepts Covered
- The Node.js JavaScript runtime environment (running code outside browser)
- Server-side JavaScript vs. Browser JavaScript (absence of `window`/`document`, presence of `process`/`global`)
- The Node Package Manager (`npm`)
- Project initialization using `npm init -y`
- Structure and purpose of `package.json` (metadata, entry point, custom scripts)

## 3. What Students Should Understand Before Starting
- Basic JavaScript syntax (variables, functions, console logging)
- How to open a terminal in VS Code (`Ctrl + ~`)
- Navigating directories using terminal commands (`cd`, `ls` or `dir`)

## 4. Scenario / Problem Statement
You are hired as a junior backend engineer on a college campus portal project. Before building web servers and APIs, you must verify your Node.js runtime environment, inspect server-side system details, and configure the project manifest (`package.json`) with an automated start script.

## 5. Learning Objective
By completing this task, you will:
1. Execute a JavaScript script using the Node.js CLI.
2. Initialize and configure a `package.json` file.
3. Access server-side environment metadata via Node.js's global `process` object.
4. Define and run custom npm scripts.

## 6. Setup and Execution Commands
From the repository root:
```bash
# Navigate to the task directory
cd tasks/01-nodejs-and-npm

# Run the script directly with Node
node app.js

# Or run using npm script (after configuring package.json)
npm start
```

## 7. Step-by-Step Requirements
1. Inspect the provided [app.js](file:///tasks/01-nodejs-and-npm/app.js).
2. Follow the `TODO` comments in `app.js`:
   - Print a greeting message: `"Welcome to Node.js Backend Development!"`.
   - Print the current Node.js version using `process.version`.
   - Print the current operating system platform using `process.platform`.
   - Implement a simple function `calculateUptime(seconds)` that returns formatted server uptime.
3. Inspect `package.json`:
   - Ensure `"main"` points to `"app.js"`.
   - Add a `"start"` script under `"scripts"`: `"start": "node app.js"`.
4. Test running your program using both `node app.js` and `npm start`.

## 8. Files Students Are Expected to Modify
- [app.js](file:///tasks/01-nodejs-and-npm/app.js)
- [package.json](file:///tasks/01-nodejs-and-npm/package.json)

## 9. API Contract
*Not applicable for this task (command-line script).*

## 10. Expected Output & Acceptance Criteria
When running `npm start`, the terminal output should match:
```text
===========================================
  Skill Lab Module 3: Node.js Fundamentals
===========================================
Welcome to Node.js Backend Development!
Node.js Version: v...
Operating System: win32 (or linux / darwin)
Process ID (PID): ...
Server Simulation: Running smoothly
===========================================
```

### Acceptance Criteria:
- [ ] Running `node app.js` outputs greeting and environment info without errors.
- [ ] Running `npm start` executes `app.js` via the npm script.
- [ ] The `package.json` file contains valid JSON with `name`, `version`, and `scripts.start`.

## 11. Test Instructions
Verify directly from terminal:
```bash
npm start
```

## 12. Progressive Hints
- **Hint 1 (Level 1)**: In Node.js, `process` is a global object available everywhere without requiring any imports.
- **Hint 2 (Level 2)**: To get the Node version, check `process.version`. To get the OS platform, check `process.platform`. To get the process ID, check `process.pid`.
- **Hint 3 (Level 3)**: In `package.json`, inside the `"scripts"` object, add `"start": "node app.js"`. Remember that JSON requires commas between keys, but NO trailing comma on the last key.

## 13. Common Errors & Debugging Advice
- **Error**: `npm ERR! missing script: start`
  - *Fix*: You forgot to define `"start": "node app.js"` inside the `"scripts"` section of `package.json`.
- **Error**: `SyntaxError: Unexpected token in JSON at position...`
  - *Fix*: Check `package.json` for missing quotes around keys/values or a trailing comma.

## 14. Extension Challenge (For Faster Students)
Use `process.argv` to accept a custom developer name passed via command line (e.g., `node app.js Priya`), and print `"Hello, Developer Priya!"`. If no argument is provided, default to `"Student"`.
