/**
 * Task 02: Main Application (app.js)
 *
 * Demonstrates consuming:
 * 1. Node.js Built-in modules (`os`, `path`)
 * 2. User-defined module (`./math`)
 */

console.log("=== Task 02: Node.js Modules Demo ===");

// ========================================================
// STEP 1: Require Node's Built-in 'os' and 'path' Modules
// 💡 Concept: Built-in modules need no './' prefix and no npm install.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the 2 lines below:
// ========================================================
// const os = require('os');
// const path = require('path');


// ========================================================
// STEP 2: Require the Local User-Defined Module './math'
// 💡 Concept: Local files MUST start with './' or '../'.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the line below:
// ========================================================
// const math = require('./math');


// ========================================================
// STEP 3: Using Built-in 'os' Module
// 💡 Concept: os.arch() gives CPU architecture; os.freemem() gives RAM in bytes.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the lines below:
// ========================================================
// console.log(`[Built-in os] Architecture: ${os.arch()}`);
// const freeMemMB = Math.round(os.freemem() / (1024 * 1024));
// console.log(`[Built-in os] Free Memory: ${freeMemMB} MB`);


// ========================================================
// STEP 4: Using Built-in 'path' Module
// 💡 Concept: path.join() handles cross-platform path separators (\ vs /).
// --------------------------------------------------------
// INSTRUCTION: Uncomment the lines below:
// ========================================================
// const joinedPath = path.join('students', 'reports', 'marksheet.pdf');
// console.log(`[Built-in path] Joined Path: ${joinedPath}`);


// ========================================================
// STEP 5: Using Custom 'math' Module
// 💡 Concept: Access exported helper functions directly on the math object.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the lines below:
// ========================================================
// const sum = math.add(25, 75);
// console.log(`[Custom math] 25 + 75 = ${sum}`);

// const avg = math.calculateAverage([80, 85, 90]);
// console.log(`[Custom math] Average Marks: ${avg}`);

// const fullName = math.formatStudentName("Asha", "Sharma");
// console.log(`[Custom math] Student Name: ${fullName}`);


// console.log("=== Module Execution Completed Successfully ===");
