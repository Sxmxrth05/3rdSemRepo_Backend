# Billora Backend API — Comprehensive Developer & API Documentation

Welcome to the **Billora Backend API** documentation. This document serves as a complete technical guide, API reference, status code dictionary, state transition matrix, and developer onboarding manual for the Billora Invoice Generator SaaS backend platform.

---

## 1. Quick Start & Developer Onboarding Guide

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`
- **Package Manager**: `npm`
- **Database**: MongoDB instance (Local or MongoDB Atlas Cluster)

### Environment Setup
Create a `.env` file inside the `backend/` directory using the provided `.env.example`:

| Variable | Type | Description | Sample Value |
|---|---|---|---|
| `NODE_ENV` | `string` | Environment state (`development` \| `production`) | `development` |
| `PORT` | `number` | Application port | `5000` |
| `MONGODB_URI` | `string` | MongoDB Atlas / Local Connection URI | `mongodb+srv://user:pass@cluster.mongodb.net/bi` |
| `JWT_ACCESS_SECRET` | `string` | Secret key for access token signing | `d2dadbe99b3703...` |
| `JWT_REFRESH_SECRET` | `string` | Secret key for refresh token signing | `e8fe0147664c...` |
| `JWT_ACCESS_EXPIRES_IN` | `string` | Expiration duration for access token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `string` | Expiration duration for refresh token | `7d` |
| `CLIENT_URL` | `string` | Frontend URL for redirects & CORS | `http://localhost:5173` |
| `CORS_ORIGINS` | `string` | Comma-separated allowlist of origins | `http://localhost:5173,http://localhost:3000` |
| `ENCRYPTION_KEY` | `string` | 64-char Hex key for payload encryption | `0123456789abcdef...` |
| `SMTP_HOST` / `SMTP_PORT` | `string`/`number` | SMTP server credentials for emails | `smtp.ethereal.email` / `587` |
| `STRIPE_SECRET_KEY` | `string` | Stripe API Secret Key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `string` | Stripe Webhook Signing Secret | `whsec_...` |

### Running the API locally
```bash
# Install dependencies
npm install

# Start in development mode (with hot-reload via tsx)
npm run dev

# Build TypeScript to production JavaScript
npm run build

# Start production server
npm start
```

---

## 2. Directory Architecture & Code Structure

```text
backend/
├── postman/
│   ├── Billora_API_Collection.json     # Full Postman Collection v2.1.0
│   └── Billora_Dev_Environment.json    # Pre-configured environment variables
├── src/
│   ├── app.ts                          # Express application setup & middleware stack
│   ├── server.ts                       # Server bootstrap & database listener connection
│   ├── config/                         # Environment & DB configuration
│   ├── middleware/                     # Auth, Zod validation, Rate limiter, Error handlers
│   ├── modules/                        # Domain feature modules
│   │   ├── auth/                       # Authentication (Register, Login, Token, Reset)
│   │   ├── users/                      # User profile management
│   │   ├── businessProfile/            # Business settings & signature data
│   │   ├── clients/                    # Client CRUD
│   │   ├── invoices/                   # Invoice CRUD, PDF generation, Emailing, Trash
│   │   ├── templates/                  # Invoice design template listings
│   │   └── billing/                    # Stripe subscription & webhook processing
│   ├── services/                       # Third-party integrations (PDF, Email, Stripe)
│   ├── types/                          # TypeScript types & Express ambient declarations
│   └── utils/                          # AppError class, logger, async wrappers
```

---

## 3. Core API Conventions & Response Contracts

### Success Response Format
All successful API responses return `200 OK` or `201 Created` with standard JSON:
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response Format
All operational and system errors return standard JSON:
```json
{
  "success": false,
  "error": {
    "message": "Human-readable description of error",
    "code": "ERROR_ENUM_CODE",
    "details": [ ... ],
    "stack": "Error: ... (Only included in NODE_ENV=development)"
  }
}
```

### Authentication Contract
Protected routes require the `Authorization` header with a Bearer JWT:
```http
Authorization: Bearer <accessToken>
```

---

## 4. HTTP Status Codes & Error Code Registry

### Standard HTTP Status Codes

| Code | Status | Usage Scenario |
|---|---|---|
| **200** | `OK` | Standard successful GET, PATCH, DELETE, or POST request |
| **201** | `Created` | Successfully created a new resource (e.g., User registration, Invoice creation) |
| **204** | `No Content` | Successful request with no body returned |
| **400** | `Bad Request` | Invalid payload syntax, malformed ObjectId (`CastError`), or missing parameters |
| **401** | `Unauthorized` | Missing, invalid, or expired JWT Access Token |
| **403** | `Forbidden` | Authenticated user lacks permission to modify/view the requested resource |
| **404** | `Not Found` | Resource or route endpoint does not exist |
| **409** | `Conflict` | Duplicate database key violation (e.g., Registering an existing email) |
| **422** | `Unprocessable Entity` | Schema validation error (Zod payload validation failures) |
| **429** | `Too Many Requests` | Exceeded rate limit (Max 100 requests per 15 minutes per IP) |
| **500** | `Internal Server Error` | Uncaught system exception or database server error |

### System Error Code Registry (`error.code`)

| Error Code | HTTP Status | Trigger Condition / Mitigation |
|---|---|---|
| `INVALID_INPUT` | `400` / `422` | Zod validation error or invalid request payload parameters |
| `INVALID_ID` | `400` | Provided string is not a valid 24-character MongoDB ObjectId (`CastError`) |
| `UNAUTHORIZED` | `401` | Missing or invalid Bearer token in request headers |
| `TOKEN_EXPIRED` | `401` | Access token duration expired (Refresh token endpoint should be called) |
| `FORBIDDEN` | `403` | User attempting to access or modify another user's invoice/client |
| `NOT_FOUND` | `404` | Resource missing in database or invalid URL path |
| `DUPLICATE_KEY_ERROR` | `409` | MongoDB duplicate key error code `11000` (e.g. Email already registered) |
| `RATE_LIMIT_EXCEEDED` | `429` | IP exceeded 100 requests / 15 min window |
| `OPERATIONAL_ERROR` | `400-500` | Custom business operational error thrown via `AppError` |
| `INTERNAL_SERVER_ERROR` | `500` | Unhandled server exception |

---

## 5. Domain Workflow & State Transition Matrices

### A. Invoice Document Lifecycle (`documentStatus`)

```mermaid
stateDiagram-v2
    [*] --> draft: Invoice Created (Default)
    draft --> sent: Email sent / PDF downloaded
    sent --> archived: User Archives Invoice
    archived --> draft: Re-opened / Edited
```

- **`draft`**: Default initial state upon creation. Edits allowed.
- **`sent`**: Triggered when `POST /invoices/:id/send` is called or explicitly updated. *(Note: `"issued"` is supported as a request payload alias for `"sent"`)*
- **`archived`**: Locked/archived state for historical storage.

### B. Invoice Payment Lifecycle (`paymentStatus`)

```mermaid
stateDiagram-v2
    [*] --> unpaid: Created
    unpaid --> partially_paid: Partial payment logged
    unpaid --> paid: Full payment received
    partially_paid --> paid: Final balance settled
    unpaid --> overdue: Due date passed
    overdue --> paid: Settled post due date
```

- **`unpaid`**: Outstanding invoice awaiting payment.
- **`partially_paid`**: Partial amount collected.
- **`paid`**: Invoice fully settled.
- **`overdue`**: Automatic or manual state when `dueDate < current_date` and status is unpaid.

### C. Trash & Recovery Lifecycle (`isDeleted`)

```mermaid
stateDiagram-v2
    Active --> Trash: DELETE /api/v1/invoices/:id (isDeleted: true)
    Trash --> Active: POST /api/v1/invoices/:id/restore (isDeleted: false)
    Trash --> Purged: (Optional) Permanent deletion
```

- **Soft Delete**: `DELETE /api/v1/invoices/:id` updates `isDeleted: true` and sets `deletedAt: Date()`.
- **List Trash**: `GET /api/v1/invoices/trash` returns soft-deleted items.
- **Restore**: `POST /api/v1/invoices/:id/restore` restores invoice back to active invoice lists.

---

## 6. Comprehensive API Endpoint Specification

### Category 1: Authentication (`/api/v1/auth`)

#### 1.1 Register Account
- **Method**: `POST`
- **Path**: `/api/v1/auth/register`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response (`201 Created`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Registration successful. Please verify your email.",
      "userId": "6a7f3030d3bcf3d0cf41628b"
    }
  }
  ```
- **Error Cases**:
  - `409 Conflict` (`DUPLICATE_KEY_ERROR`): Email is already registered.
  - `422 Unprocessable Entity`: Password doesn't meet complexity criteria.

#### 1.2 Login Account
- **Method**: `POST`
- **Path**: `/api/v1/auth/login`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "samarthnaik2005@gmail.com",
    "password": "Password123!"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "6a7f33f10e7ebd22e24144f4",
        "name": "Samarth Naik",
        "email": "samarthnaik2005@gmail.com",
        "plan": "free"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
  }
  ```
- **Error Cases**:
  - `401 Unauthorized`: Invalid credentials provided.

#### 1.3 Forgot Password
- **Method**: `POST`
- **Path**: `/api/v1/auth/forgot-password`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "email": "samarthnaik2005@gmail.com"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "If that email exists, a password reset link has been sent.",
      "resetToken": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    }
  }
  ```
  *(Note: `resetToken` is included in `data` and logged to console when `NODE_ENV=development` to simplify manual Postman testing)*

#### 1.4 Reset Password
- **Method**: `POST`
- **Path**: `/api/v1/auth/reset-password`
- **Auth Required**: No
- **Request Body**:
  ```json
  {
    "token": "reset_token_here",
    "newPassword": "NewPassword123!"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Password updated successfully. Please log in with your new password."
    }
  }
  ```
- **Error Cases**:
  - `400 Bad Request` (`INVALID_RESET_TOKEN`): Invalid or expired password reset token.
  - `422 Unprocessable Entity` (`VALIDATION_ERROR`): Missing `token` or `newPassword` (must be at least 8 characters).

---

### Category 2: Users & Business Profile (`/api/v1/users`, `/api/v1/business-profile`)

#### 2.1 Get Current User (Me)
- **Method**: `GET`
- **Path**: `/api/v1/users/me`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "6a7f33f10e7ebd22e24144f4",
        "name": "Samarth Naik",
        "email": "samarthnaik2005@gmail.com",
        "isVerified": false,
        "plan": "free",
        "createdAt": "2026-08-14T15:27:45.283Z"
      }
    }
  }
  ```

#### 2.2 Get Business Profile
- **Method**: `GET`
- **Path**: `/api/v1/business-profile`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "businessName": "Billora Technologies",
      "phone": "+1-555-0199",
      "address": "123 Innovation Way, Suite 100",
      "taxId": "TAX-998877",
      "defaultSignature": {
        "type": "font",
        "value": "Samarth Naik"
      }
    }
  }
  ```

#### 2.3 Change Password
- **Method**: `POST`
- **Path**: `/api/v1/users/change-password`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Request Body**:
  ```json
  {
    "currentPassword": "Password123!",
    "newPassword": "NewPassword123!"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Password updated successfully. Please log in again."
    }
  }
  ```

#### 2.4 Delete Account
- **Method**: `DELETE`
- **Path**: `/api/v1/users/me`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Account and associated data permanently deleted."
    }
  }
  ```

#### 2.5 Update Business Signature
- **Method**: `POST`
- **Path**: `/api/v1/business-profile/signature`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Request Body**:
  ```json
  {
    "type": "font",
    "value": "Samarth Naik"
  }
  ```
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "defaultSignature": {
        "type": "font",
        "value": "Samarth Naik"
      }
    }
  }
  ```

---

### Category 3: Clients (`/api/v1/clients`)

#### 3.1 List Clients
- **Method**: `GET`
- **Path**: `/api/v1/clients`
- **Auth Required**: Yes (`Bearer <accessToken>`)

#### 3.2 Create Client
- **Method**: `POST`
- **Path**: `/api/v1/clients`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Request Body**:
  ```json
  {
    "name": "Acme Global Solutions",
    "email": "contact@acmeglobal.com",
    "phone": "+1-800-555-0199",
    "address": "456 Enterprise Boulevard, Tech Park",
    "notes": "VIP Enterprise Client"
  }
  ```

#### 3.3 Get Client By ID
- **Method**: `GET`
- **Path**: `/api/v1/clients/:id`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "66bc8e91e2b8a00112345678",
      "userId": "6a7f33f10e7ebd22e24144f4",
      "name": "Acme Global Solutions",
      "email": "contact@acmeglobal.com",
      "address": "456 Enterprise Blvd",
      "isArchived": false
    }
  }
  ```

#### 3.4 Get Client Invoices
- **Method**: `GET`
- **Path**: `/api/v1/clients/:id/invoices`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Success Response (`200 OK`)**: Returns array of all active invoices billed to this client ID.

#### 3.5 Unarchive Client
- **Method**: `POST`
- **Path**: `/api/v1/clients/:id/unarchive`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Client unarchived successfully",
      "client": {
        "isArchived": false
      }
    }
  }
  ```

---

### Category 4: Invoices (`/api/v1/invoices`)

#### 4.1 Create Invoice
- **Method**: `POST`
- **Path**: `/api/v1/invoices`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Request Body**:
  ```json
  {
    "client": {
      "name": "Acme Global Solutions",
      "email": "billing@acmeglobal.com",
      "address": "456 Enterprise Boulevard, Suite 500"
    },
    "lineItems": [
      {
        "description": "Full-Stack Web Application Development",
        "quantity": 1,
        "unitPrice": 2500
      },
      {
        "description": "Cloud Hosting Setup & Maintenance",
        "quantity": 2,
        "unitPrice": 300
      }
    ],
    "currency": "USD",
    "taxRate": 10,
    "template": "modern",
    "colorScheme": "#2196F3",
    "font": "Inter",
    "documentStatus": "draft",
    "paymentStatus": "unpaid"
  }
  ```
- **Automatic Calculations**:
  - `subtotal` = $(1 \times 2500) + (2 \times 300) = 3100$
  - `taxAmount` = $3100 \times 0.10 = 310$
  - `total` = $3100 + 310 = 3410$
  - `invoiceNumber` = Auto-assigned sequence (`INV-0001`, `INV-0002`, etc.)

#### 4.2 Permanent Delete Invoice
- **Method**: `DELETE`
- **Path**: `/api/v1/invoices/:id/permanent`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Requirement**: Invoice must already be in trash (`isDeleted: true`).
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Invoice permanently deleted"
    }
  }
  ```

#### 4.3 Empty Trash
- **Method**: `POST`
- **Path**: `/api/v1/invoices/trash/empty`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "message": "Trash emptied successfully. 5 invoices removed."
    }
  }
  ```

#### 4.4 Duplicate Invoice
- **Method**: `POST`
- **Path**: `/api/v1/invoices/:id/duplicate`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Behavior**: Clones line items, client details, styling, and signature into a new draft invoice assigned the next sequential `invoiceNumber`.
- **Success Response (`201 Created`)**: Returns newly created duplicate draft invoice object.

#### 4.5 Update Invoice Status
- **Method**: `PATCH`
- **Path**: `/api/v1/invoices/:id/status`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Request Body**:
  ```json
  {
    "documentStatus": "sent",
    "paymentStatus": "paid"
  }
  ```
- **Success Response (`200 OK`)**: Returns updated invoice.

#### 4.6 Get Public Invoice Details
- **Method**: `GET`
- **Path**: `/api/v1/invoices/public/:shareToken`
- **Auth Required**: No (Public Client Share Link)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "invoice": { ... },
      "businessProfile": {
        "businessName": "Billora Technologies",
        "email": "billing@billora.com",
        "phone": "+1-555-0199",
        "address": "123 Innovation Way"
      }
    }
  }
  ```

---

### Category 5: Templates & Billing (`/api/v1/templates`, `/api/v1/billing`)

#### 5.1 Get Template By Slug
- **Method**: `GET`
- **Path**: `/api/v1/templates/:slug`
- **Auth Required**: No
- **Success Response (`200 OK`)**: Returns design template metadata and styling defaults for requested template slug (`modern`, `classic`, `minimalist`).

#### 5.2 Get Billing Subscription & Metrics
- **Method**: `GET`
- **Path**: `/api/v1/billing/subscription`
- **Auth Required**: Yes (`Bearer <accessToken>`)
- **Success Response (`200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "plan": "free",
      "invoiceLimit": 5,
      "invoicesCount": 2,
      "status": "active"
    }
  }
  ```

#### 5.3 Stripe Webhook Listener
- **Method**: `POST`
- **Path**: `/api/v1/billing/webhook`
- **Auth Required**: No (Stripe Signature Verified via `Stripe-Signature` Header)
- **Raw Body Required**: Handled with `express.raw({ type: 'application/json' })` before standard JSON parser middleware.

---

## 7. Security & Protection Layers

1. **Helmet HTTP Headers**: Secures against XSS, clickjacking, and mime sniffing.
2. **Strict CORS Policy**: Only origins declared in `CORS_ORIGINS` are permitted.
3. **Rate Limiting**: `express-rate-limit` enforces a maximum of 100 requests per 15 minutes per IP across all `/api` routes.
4. **NoSQL Injection Guard**: `express-mongo-sanitize` strips `$` and `.` operators from incoming payload keys.

---

## 8. Developer Handover & Future Technical Roadmap

### Current Status
- ✅ Full User Authentication & Refresh Token Architecture (with Password Change & Account Deletion)
- ✅ Business Profile & Custom Signature Upload (`POST /api/v1/business-profile/signature`)
- ✅ Client Management (Get by ID, Client Invoices, Unarchive Client)
- ✅ Advanced Invoice Operations (Duplicate, Status Update, Public Share Link, Single/Bulk Hard Delete from Trash)
- ✅ Template Details by Slug (`GET /api/v1/templates/:slug`)
- ✅ Billing Subscription Status & Monthly Usage Metrics (`GET /api/v1/billing/subscription`)
- ✅ Stripe Subscription Integration & Webhook Listener
- ✅ Automated Postman Sync via Skill (`billora-postman-sync`)

### Recommended Next Steps for incoming Developers
1. **Recurring Invoices Engine**: Implement a cron scheduler (e.g. `node-cron` or Agenda) to auto-generate invoices on monthly recurring dates.
2. **Multi-Currency Converter**: Integrate a live exchange rate API (e.g. Fixer / ExchangeRate-API) to support real-time currency conversions.
3. **Audit Log Trail**: Track user history for invoice state modifications (`draft` ➔ `sent` ➔ `paid`).

