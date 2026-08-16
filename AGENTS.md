# Project Guidelines & Rules for Billora

## Automatic API Documentation & Postman Sync Rule

Whenever you add, edit, refactor, or delete any API endpoint, route definition, request/response schema, controller, or status code in the backend codebase (e.g., files in `backend/src/modules/`, `backend/src/app.ts`, or related middleware/controllers):

1. **Update API Documentation**:
   - Immediately update [`backend/API_DOCUMENTATION.md`](file:///c:/Users/Samarth%20Naik/OneDrive/Desktop/Invoice_gen/backend/API_DOCUMENTATION.md) to reflect the new or modified endpoint path, HTTP method, authentication requirements, request body JSON format, status codes, and error response shapes.
   - If new status codes, state transitions, or error codes are added, update Section 4 (HTTP Status Codes & Error Registry) and Section 5 (Workflow State Transitions) in `API_DOCUMENTATION.md`.

2. **Sync Postman Collection**:
   - Update [`backend/postman/Billora_API_Collection.json`](file:///c:/Users/Samarth%20Naik/OneDrive/Desktop/Invoice_gen/backend/postman/Billora_API_Collection.json) and publish the updated category-wise collection to Postman workspace `Billora` (`92520e95-c0cc-4f1b-90bf-3373fa967bf0`) using the `billora-postman-sync` skill / Postman MCP server tools.

3. **Verify & Inform**:
   - Confirm to the user that both `API_DOCUMENTATION.md` and the Postman workspace collection have been updated alongside the code changes.
