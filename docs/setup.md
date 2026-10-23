# Environment Setup Guide

Welcome to **Module 3: Backend Development with Node.js and Express** of the Full Stack Development Skill Lab.

This guide walks you through setting up your machine so you can run Node.js applications, test APIs with Postman, and complete all lab tasks smoothly.

---

## 1. Prerequisites Checklist

Before you begin, ensure you have the following software installed on your computer:

| Software | Minimum Version | Purpose | Download Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` or higher | JavaScript backend runtime | [nodejs.org](https://nodejs.org/) |
| **npm** | `v9.0.0` or higher | Node package manager (bundled with Node) | Included with Node.js |
| **VS Code** | Latest | Code editor and integrated terminal | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Postman** | Latest Desktop App | Manual API testing client | [postman.com/downloads](https://www.postman.com/downloads/) |
| **Git** | `v2.30.0` or higher | Version control system | [git-scm.com](https://git-scm.com/) |

---

## 2. Verify Your Installation

Open a terminal (in VS Code: `Terminal` -> `New Terminal`, or open PowerShell / Bash):

```bash
# 1. Verify Node.js
node -v
# Expected: v18.x.x, v20.x.x, or v22+

# 2. Verify npm
npm -v
# Expected: 9.x.x or 10+

# 3. Verify Git
git --version
# Expected: git version 2.x.x
```

> [!NOTE]
> If any command says `'command not found'` or `'is not recognized as an internal or external command'`, reinstall the software and make sure to check the box: **"Add to PATH"**.

---

## 3. Clone & Project Initialization

### Step 3.1: Clone the Repository

```bash
git clone https://github.com/Sxmxrth05/3rdSemRepo_Backend.git
cd 3rdSemRepo_Backend
```

### Step 3.2: Install Dependencies

The repository has a root `package.json` that provides the necessary libraries (`express`, `supertest`):

```bash
npm install
```

This will create a `node_modules/` folder containing dependencies for testing and running your apps.

---

## 4. Recommended VS Code Extensions

For an optimal lab experience, install these extensions from the VS Code Extensions tab (`Ctrl+Shift+X`):

1. **Prettier - Code formatter** (`esbenp.prettier-vscode`): Keeps JavaScript and JSON clean and indented.
2. **ESLint** (`dbaeumer.vscode-eslint`): Highlights syntax issues and missing variables in real time.
3. **Thunder Client** or **Postman VS Code Extension** (Optional): If you prefer testing APIs directly inside VS Code instead of the standalone Postman desktop app.

---

## 5. How the Lab is Organized

The lab is divided into 9 sequential hands-on tasks inside the `tasks/` directory:

```text
tasks/
├── 01-nodejs-and-npm/         # Node.js CLI, running JS outside browser, package.json
├── 02-modules/                # CommonJS modules (require / module.exports)
├── 03-http-server/            # Built-in http module, req & res, port 3000
├── 04-http-routing/           # URL-based routing (/, /about, /students, 404)
├── 05-express-basics/         # Express app, app.get, JSON responses
├── 06-rest-and-crud/          # Full REST CRUD with GET, POST, PUT, DELETE
├── 07-postman-testing/        # Importing Postman collection, testing live APIs
├── 08-validation-and-errors/  # Status codes (400, 404), input validation, search
└── 09-final-challenge/        # Independent Student Management REST API build
```

---

## 6. Verification Commands

At each step, you can verify your code using the built-in test runner:

```bash
# Run all automated tests
npm test

# Run tests for a specific task
npm run test:03
npm run test:04
npm run test:05
npm run test:06
npm run test:08
npm run test:09
```

---

## 7. Next Steps

Proceed to [concepts.md](file:///docs/concepts.md) to understand the core backend principles, or open [tasks/01-nodejs-and-npm/TASK.md](file:///tasks/01-nodejs-and-npm/TASK.md) to start Task 1.
