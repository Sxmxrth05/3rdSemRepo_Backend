# Task 02: Node.js Modules (Built-in and User-Defined)

## 1. Task Number & Title
**Task 02**: Node.js Modules & Code Reusability

## 2. Concepts Covered
- What are modules and why do backend applications modularize code?
- The three module categories in Node.js (Built-in, User-defined, External)
- Built-in modules: `path` (normalizing file paths) and `os` (CPU architecture, free memory)
- Creating user-defined modules using CommonJS `module.exports`
- Consuming modules using `require('./moduleName')`

## 3. What Students Should Understand Before Starting
- Completion of Task 01 (running Node scripts from terminal)
- JavaScript functions and object exports
- Relative file paths (`./` for current directory)

## 4. Scenario / Problem Statement
As your backend grows, keeping all functions inside a single giant file leads to spaghetti code. You must modularize mathematical and utility helper functions (like calculating average student marks or determining attendance percentages) into an independent utility file (`math.js`), and consume those helpers in the main application (`app.js`) alongside Node's built-in `path` and `os` modules.

## 5. Learning Objective
By completing this task, you will:
1. Export functions and constants using CommonJS `module.exports`.
2. Import custom modules using relative paths with `require()`.
3. Import and use Node's built-in `os` and `path` modules without installing external packages.

## 6. Setup and Execution Commands
From the repository root:
```bash
# Navigate to Task 02
cd tasks/02-modules

# Run the application
node app.js
```

## 7. Step-by-Step Requirements
1. Open [math.js](file:///tasks/02-modules/math.js):
   - Complete the `add(a, b)` function to return the sum of two numbers.
   - Complete the `calculateAverage(numbers)` function to return the average of an array of numbers.
   - Complete the `formatStudentName(firstName, lastName)` function to return a formatted full name in title case.
   - Export these three functions using `module.exports = { add, calculateAverage, formatStudentName };`.
2. Open [app.js](file:///tasks/02-modules/app.js):
   - Import your custom module using `const math = require('./math');`.
   - Import the built-in `os` and `path` modules using `require('os')` and `require('path')`.
   - Call the functions from `math` and print the results as instructed by the TODO comments.
   - Print the system architecture using `os.arch()` and join sample paths using `path.join()`.

## 8. Files Students Are Expected to Modify
- [math.js](file:///tasks/02-modules/math.js)
- [app.js](file:///tasks/02-modules/app.js)

## 9. API Contract
*Not applicable for this task (command-line script).*

## 10. Expected Output & Acceptance Criteria
When running `node app.js`, the output should match:
```text
=== Task 02: Node.js Modules Demo ===
[Built-in os] Architecture: x64 (or arm64)
[Built-in os] Free Memory: ... MB
[Built-in path] Joined Path: students/reports/marksheet.pdf
[Custom math] 25 + 75 = 100
[Custom math] Average Marks: 85
[Custom math] Student Name: Asha Sharma
=== Module Execution Completed Successfully ===
```

### Acceptance Criteria:
- [ ] `math.js` correctly exports the functions using `module.exports`.
- [ ] `app.js` successfully imports `math.js` without path errors.
- [ ] Built-in modules `os` and `path` are used properly without npm installations.
- [ ] Calculations produce mathematically accurate results.

## 11. Test Instructions
Run the script directly:
```bash
node app.js
```

## 12. Progressive Hints
- **Hint 1 (Level 1)**: For custom local files, always use a relative path like `./math` in `require('./math')`. For built-in modules, do NOT use `./` (use `require('os')`).
- **Hint 2 (Level 2)**: In `math.js`, `calculateAverage(numbers)` can use `numbers.reduce((sum, n) => sum + n, 0) / numbers.length`. If the array is empty, return 0.
- **Hint 3 (Level 3)**: Export an object containing all functions:
  ```javascript
  module.exports = {
    add,
    calculateAverage,
    formatStudentName
  };
  ```

## 13. Common Errors & Debugging Advice
- **Error**: `Cannot find module 'math'`
  - *Fix*: You wrote `require('math')` instead of `require('./math')`. Without `./`, Node looks inside `node_modules` instead of your local folder.
- **Error**: `TypeError: math.add is not a function`
  - *Fix*: Check how `math.js` exports its functions. Make sure you assigned an object with `add` to `module.exports`.

## 14. Extension Challenge (For Faster Students)
Add a function `isEligibleForExam(attendancePercentage, minRequired = 75)` to `math.js` that returns a boolean. Export and test it in `app.js`.
