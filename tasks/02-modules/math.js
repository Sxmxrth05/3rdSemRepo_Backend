/**
 * Task 02: User-Defined Module (math.js)
 *
 * Implement helper utility functions and export them using CommonJS.
 */

// ========================================================
// STEP 1: Add Two Numbers
// 💡 Concept: Functions encapsulate reusable logic.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the function below:
// ========================================================
function add(a, b) {
  return a + b;
}


// ========================================================
// STEP 2: Calculate Average of an Array of Numbers
// 💡 Concept: Guard against empty arrays to prevent division by zero (NaN).
// --------------------------------------------------------
// INSTRUCTION: Uncomment the function below:
// ========================================================
function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }
  const total = numbers.reduce((sum, val) => sum + val, 0);
  return total / numbers.length;
}


// ========================================================
// STEP 3: Format Student's Full Name
// 💡 Concept: String .trim() strips unintended leading/trailing whitespace.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the function below:
// ========================================================
function formatStudentName(firstName, lastName) {
  const first = (firstName || "").trim();
  const last = (lastName || "").trim();
  return `${first} ${last}`.trim();
}


// ========================================================
// STEP 4: Export Functions using CommonJS module.exports
// 💡 Concept: module.exports defines the public interface of this module.
// --------------------------------------------------------
// INSTRUCTION: Uncomment the export statement below:
// ========================================================
module.exports = {
  add,
  calculateAverage,
  formatStudentName
};
