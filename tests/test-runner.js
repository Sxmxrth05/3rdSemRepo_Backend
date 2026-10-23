/**
 * Unified Test Runner for Skill Lab Module 3
 *
 * Runs all automated test suites sequentially.
 * Supports `--solutions` flag or `TEST_SOLUTIONS=true` environment variable.
 */

const { spawnSync } = require('child_process');
const path = require('path');

const isSolutions = process.argv.includes('--solutions') || process.env.TEST_SOLUTIONS === 'true';

const testFiles = [
  'tests/03-http-server.test.js',
  'tests/04-http-routing.test.js',
  'tests/05-express-basics.test.js',
  'tests/06-rest-and-crud.test.js',
  'tests/08-validation-and-errors.test.js',
  'tests/09-final-challenge.test.js'
];

console.log('====================================================');
console.log(` Running Module 3 Test Suites [Target: ${isSolutions ? 'INSTRUCTOR SOLUTIONS' : 'STUDENT TASKS'}]`);
console.log('====================================================\n');

let totalPassed = 0;
let totalFailed = 0;

for (const testFile of testFiles) {
  console.log(`▶ Executing: ${testFile}`);
  const env = { ...process.env, TEST_SOLUTIONS: isSolutions ? 'true' : 'false' };
  const result = spawnSync('node', ['--test', '--test-timeout=3000', testFile], {
    env,
    stdio: 'inherit',
    shell: true
  });

  if (result.status === 0) {
    totalPassed++;
  } else {
    totalFailed++;
  }
  console.log('----------------------------------------------------\n');
}

console.log('====================================================');
console.log(` Test Summary: ${totalPassed} Passed, ${totalFailed} Failed`);
console.log('====================================================');

process.exit(totalFailed === 0 ? 0 : 1);
