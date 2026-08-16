---
name: billora-postman-sync
description: >-
  Syncs, updates, and creates category-wise Postman collections for the Billora backend API in Postman workspace 'Billora' via Postman MCP server.
  Use this skill whenever the user asks to sync, update, regenerate, or publish Postman collections or API endpoints for Billora.
---

# Billora Postman Sync Skill

This skill provides step-by-step instructions to scan Billora backend API routes, generate/update category-wise Postman collections with request bodies, auto-token setup, and publish them directly to Postman via the Postman MCP server.

---

## Workspace & Target Configuration

- **Target Workspace Name**: `Billora`
- **Target Workspace ID**: `92520e95-c0cc-4f1b-90bf-3373fa967bf0`
- **Collection Name**: `Billora API Collection`
- **Local Collection File**: [`backend/postman/Billora_API_Collection.json`](file:///c:/Users/Samarth%20Naik/OneDrive/Desktop/Invoice_gen/backend/postman/Billora_API_Collection.json)
- **Base URL Variable**: `{{baseUrl}}` (Default: `http://localhost:5000`)
- **Access Token Variable**: `{{accessToken}}`

---

## Categories Overview

The collection MUST organize all backend endpoints into the following 7 category folders:

1. **1. Auth** (`/api/v1/auth`)
   - `POST /register`
   - `POST /verify-email`
   - `POST /login` *(With post-response test script saving `accessToken` to Postman environment)*
   - `POST /refresh`
   - `POST /forgot-password`
   - `POST /reset-password`
   - `POST /logout`
2. **2. Users & Business Profile** (`/api/v1/users`, `/api/v1/business-profile`)
   - `GET /users/me`
   - `PATCH /users/me`
   - `GET /business-profile`
   - `PATCH /business-profile`
3. **3. Clients** (`/api/v1/clients`)
   - `GET /clients`
   - `POST /clients`
   - `PATCH /clients/:id`
   - `DELETE /clients/:id`
4. **4. Invoices** (`/api/v1/invoices`)
   - `GET /invoices`
   - `POST /invoices`
   - `GET /invoices/:id`
   - `PATCH /invoices/:id`
   - `DELETE /invoices/:id` (Soft Delete)
   - `GET /invoices/trash`
   - `POST /invoices/:id/restore`
   - `GET /invoices/:id/download`
   - `POST /invoices/:id/send`
5. **5. Templates** (`/api/v1/templates`)
   - `GET /templates`
6. **6. Billing & Subscriptions** (`/api/v1/billing`)
   - `POST /billing/checkout`
   - `GET /billing/portal`
   - `POST /billing/webhook`
7. **7. System & Health**
   - `GET /`
   - `GET /health`
   - `GET /api/v1`

---

## Execution Workflow

When running this skill, execute the following steps:

### Step 1: Scan Backend Routes
Read `backend/src/app.ts` and inspect module route definitions under `backend/src/modules/*/` to discover any newly added or modified endpoints.

### Step 2: Build/Update Local Collection JSON
Update `backend/postman/Billora_API_Collection.json` with the full Postman Collection v2.1.0 schema structure, ensuring:
- All `POST`, `PATCH`, and `PUT` endpoints have realistic sample JSON request bodies (`mode: "raw"`, `options: { raw: { language: "json" } }`).
- Authenticated endpoints include `Authorization: Bearer {{accessToken}}` in the headers.
- The `Login Account` request includes a test script:
  ```javascript
  var jsonData = pm.response.json();
  if (jsonData.success && jsonData.data && jsonData.data.accessToken) {
      pm.environment.set('accessToken', jsonData.data.accessToken);
  }
  ```

### Step 3: Publish to Postman Workspace via MCP
1. Call Postman MCP tool `getCollections` with `workspace: "92520e95-c0cc-4f1b-90bf-3373fa967bf0"` to check existing collections.
2. Call `createCollection` or `putCollection` with the workspace ID `92520e95-c0cc-4f1b-90bf-3373fa967bf0` and collection payload.

### Step 4: Verify and Report
Confirm the updated collection ID and present a clear breakdown of synced categories and endpoints to the user.
