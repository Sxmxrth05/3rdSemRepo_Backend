# Billora — Product Requirements Document (PRD)

**Version:** 1.1 (revised — see changelog)
**Product:** Billora — Invoice Generator SaaS
**Prepared for:** Samarth Naik
**Date:** 2026-08-14
**Brand color:** #2196F3 (Material Blue), gradient accent to #0D47A1

### Changelog from v1.0
- Resolved contradiction between the $6 paid plan and "no payment gateway" scope.
- Added Business/Sender Profile (required for any real invoice).
- Split invoice **document status** (Draft/Sent/Archived) from **payment status** (Unpaid/Paid/Overdue/Partially Paid); renamed "Published" → "Sent".
- Added "Send invoice via email" alongside Download.
- Added Client management (saved clients).
- Added Terms of Service, Forgot Password, Account/Billing Settings, and 404 to the sitemap.
- Clarified the "Changing value" customization item as an open question.
- Defined an invoice numbering rule for deleted/trashed/draft edge cases.
- Moved signature to a reusable profile default with a per-invoice override.

---

## 1. Product Overview

Billora is a web-based SaaS platform that lets freelancers, small businesses, and agencies create, customize, send, and track professional invoices — with built-in e-signature support. The platform focuses on speed (create and send an invoice in under a minute) and customization (fonts, color schemes, currencies, tax rates, signatures) without requiring design skills.

**Core value proposition:** Generate a branded, signed, tax-correct invoice in minutes, send it to your client, track whether it's been paid, and never worry about losing it — with a 30-day recovery window on deleted invoices.

---

## 2. Goals & Objectives

- Launch a self-serve invoicing tool with a free tier and a $6/month paid tier, with a working payment flow from day one.
- Reduce time-to-first-invoice for a new user to under 3 minutes from signup.
- Support global usage from day one (multi-currency, customizable tax rate).
- Give users visibility into whether they've actually been paid, not just whether a document exists.
- Build the foundation to expand into proposals and external e-signature workflows beyond invoicing.

---

## 3. Target Users

- **Freelancers** (designers, developers, consultants) who need quick, professional-looking invoices.
- **Small business owners** who don't have accounting software but need to bill clients.
- **Agencies** managing multiple clients and needing consistent branded invoice templates.

---

## 4. Scope

### In scope (v1)
- Email-based authentication (signup, login, forgot password)
- Business/sender profile (name, logo, address, contact info, default signature)
- Client management (save and reuse client details)
- Dashboard with recent invoices, document status, payment status, and trash/recovery
- Invoice creation flow with template selection
- Invoice customization: font, color scheme, signature, currency, tax rate
- Auto-incrementing invoice numbers based on history
- PDF download **and** email-send of generated invoices
- Marking invoices as Paid / Unpaid / Overdue / Partially Paid
- Marketing pages: Home, About Us, Contact Us, Privacy Policy, Terms of Service, Pricing
- Free tier and $6/month paid tier with a working subscription payment flow (minimal Stripe Checkout integration)

### Out of scope (v1, future roadmap)
- Proposal generation workflows
- External e-signature requests (signing by someone other than the invoice owner, via link)
- Recurring/subscription invoicing for end clients
- Multi-user team accounts with roles
- Automated payment reminders (nice-to-have fast-follow)

---

## 5. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + Next.js, styled with Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Atlas) |
| ODM | Mongoose |
| Validation | Zod (frontend and backend) |
| Auth | Email/password, JWT (access + refresh pattern) |
| Payments | Stripe (subscription checkout for the $6 plan) |
| File/PDF generation | Server-side HTML-to-PDF rendering (e.g., Puppeteer or equivalent — verify latest stable option at build time) |
| Email delivery | Nodemailer via SMTP provider (e.g., Resend/SendGrid) — for sending invoices and password resets |
| Deployment | Frontend: Vercel. Backend: Render/Railway. DB: MongoDB Atlas |

Dependency versions are not pinned in this document — verify latest stable and security status for each package at implementation time (npm registry + advisory search) rather than copying versions from any reference doc.

---

## 6. Brand Guidelines

- **Primary color:** #2196F3
- **Gradient accent:** #2196F3 → #0D47A1 (no green/teal tones anywhere in the palette)
- **Logo variants:** light background, dark background, monochrome icon mark, gradient/premium hero variant
- **Typography:** Geometric sans-serif for wordmark and UI (final selection during design phase)
- **Tone:** Clean, trustworthy, professional fintech — not playful

---

## 7. Information Architecture (Sitemap)

```
Marketing Site
├── Home
│   ├── Header
│   └── Hero
├── About Us
├── Contact Us
├── Privacy Policy
├── Terms of Service
├── Pricing
│   └── Pricing Table
│       ├── Free Forever
│       └── $6/month
└── 404 Not Found
```

```
App (authenticated)
├── Login / Signup / Forgot Password (email-based)
├── Dashboard
│   ├── Recent Invoices
│   │   ├── Document status: Draft, Sent, Archived
│   │   └── Payment status: Unpaid, Paid, Overdue, Partially Paid
│   └── Trash (30-day recovery)
├── Clients
│   └── Saved client list (add / edit / reuse on new invoices)
├── Create Invoice
│   ├── Template Selection
│   └── Customization
│       ├── Invoice font
│       ├── Invoice color scheme
│       ├── Signature (defaults from profile; font-based or canvas-drawn; per-invoice override)
│       ├── Line items & manual value adjustments
│       ├── Currency (all currencies supported)
│       ├── Tax rate
│       ├── Download (PDF)
│       ├── Send via email
│       └── Invoice number (auto-incremented from history)
└── Settings
    ├── Business Profile (name, logo, address, contact info, default signature)
    └── Account & Billing (manage $6 subscription, payment method)
```

---

## 8. Feature Requirements

### 8.1 Authentication
- Email + password signup and login.
- Email verification on signup (reduces spam accounts).
- Forgot password / reset via email link.
- JWT access token (15 min) + refresh token (7 days, HttpOnly cookie), with rotation.

### 8.2 Business Profile (new in v1.1)
- User sets up business name, logo upload, address, email, and phone once.
- This information auto-populates on every invoice as the "from" party.
- User can set a default signature here, reused on new invoices unless overridden.

### 8.3 Client Management (new in v1.1)
- Save client name, email, and address once; reuse on future invoices via a picker in the Create Invoice flow.
- Edit or archive saved clients.

### 8.4 Dashboard
- Lists recent invoices with two independent badges:
  - **Document status:** Draft, Sent, Archived.
  - **Payment status:** Unpaid, Paid, Overdue, Partially Paid.
- Each invoice row shows: invoice number, client name, amount, currency, document status, payment status, last updated date.
- Filter/search by status and client name.
- **Trash:** deleted invoices move to trash and are recoverable for 30 days, after which they are permanently purged (TTL-based cleanup). A "Restore" action is available from the trash view.

### 8.5 Create Invoice Flow
1. User clicks **Create** from the dashboard.
2. User selects an **invoice template** from a gallery of pre-built layouts.
3. User selects a saved client (or enters new client details), and confirms their own business profile info is correct.
4. User enters line items (description, quantity, unit price) and due date.
5. User customizes:
   - **Font:** choose from a curated list of professional fonts.
   - **Color scheme:** choose an accent color for the invoice layout.
   - **Signature:** defaults to the profile signature; can be overridden per invoice (typed font-style or canvas-drawn).
   - **Currency:** select from a full list of supported currencies (symbol + code formatting).
   - **Tax rate:** enter a custom tax percentage, applied to the subtotal automatically.
6. Invoice number is **auto-assigned** at creation time (see numbering rule below).
7. User saves as **Draft**, or marks as **Sent** (which also triggers the email-send option).
8. User can **download as PDF** or **send via email** at any point.
9. User (or the system, based on due date) updates **payment status** as Paid / Partially Paid / Overdue.

### 8.6 Invoice Numbering Rule (clarified in v1.1)
- A unique sequential number is assigned the moment an invoice is created (including Drafts), not only on Send.
- Numbers are never reused, even if the invoice is later deleted or permanently removed from trash — this guarantees no duplicate numbers, at the cost of allowing gaps in the sequence (standard accounting practice).
- Restoring an invoice from trash keeps its original number.
- Format is configurable per business profile (e.g., `INV-0001`, prefix optional).

### 8.7 Document & Payment Status Lifecycle
- **Document status:** `Draft → Sent → Archived`, with a separate soft-delete path to `Trash` (recoverable 30 days) from any status.
- **Payment status** (independent axis): `Unpaid → Partially Paid → Paid`, or `Unpaid → Overdue` if past due date unpaid. Payment status can be updated manually by the user at any document status.

### 8.8 Customization Details
| Feature | Requirement |
|---|---|
| Invoice font | Selectable from a preset list; applied to invoice preview and PDF output |
| Color scheme | User-selectable accent/theme color per invoice |
| Signature | Defaults from business profile; per-invoice override; typed (font-style) or freehand canvas drawing saved as an image/SVG |
| Line items & manual values | Add/remove line items; description, quantity, unit price; manual adjustment field for discounts or overrides *(pending confirmation — see Open Questions)* |
| Currency | Full ISO currency list with correct symbol and formatting |
| Tax rate | Custom percentage field, auto-calculated into invoice total |
| Download | One-click PDF export matching the on-screen preview |
| Send via email | Emails the client a copy of the invoice (PDF attached or link) directly from the app |
| Invoice numbering | Auto-assigned at creation, never reused, per numbering rule above |

### 8.9 Marketing Site Pages
- **Home:** Header (nav + logo + CTA) and Hero section (value proposition, signup CTA).
- **About Us:** Company/product story.
- **Contact Us:** Contact form or support email.
- **Privacy Policy:** Standard privacy policy content.
- **Terms of Service:** Standard ToS content (new in v1.1).
- **Pricing:** Pricing table with two tiers — **Free Forever** and **$6/month**, linking into a working Stripe checkout for the paid tier.
- **404:** Not-found page for broken/unknown routes (new in v1.1).

### 8.10 Account & Billing (new in v1.1)
- User can view their current plan (Free or Pro), upgrade/downgrade, and manage payment method via Stripe Customer Portal (or equivalent).
- Invoice/receipt history for the user's own Billora subscription.

---

## 9. Data Models (high level)

**User**
```
_id, name, email, passwordHash, isVerified, plan (free | pro),
stripeCustomerId, createdAt, updatedAt
```

**BusinessProfile**
```
_id, userId, businessName, logoUrl, address, email, phone,
defaultSignature: { type: "font" | "drawn", value },
invoiceNumberPrefix, createdAt, updatedAt
```

**Client**
```
_id, userId, name, email, address, isArchived, createdAt, updatedAt
```

**Invoice**
```
_id, userId, clientId, invoiceNumber, documentStatus (draft | sent | archived),
paymentStatus (unpaid | partially_paid | paid | overdue),
client: { name, email, address },   // snapshot at time of creation
lineItems: [{ description, quantity, unitPrice }],
currency, taxRate, subtotal, taxAmount, total,
template, colorScheme, font,
signature: { type: "font" | "drawn", value },
dueDate, isDeleted, deletedAt, createdAt, updatedAt
```

**Template**
```
_id, name, previewImageUrl, layoutConfig
```

Soft-delete (`isDeleted` + `deletedAt`) with a TTL index or scheduled job drives the 30-day trash recovery window. Client info is snapshotted onto the invoice at creation time so edits to a saved client don't retroactively change past invoices.

---

## 10. API Endpoints (high level)

Following `/api/v1` convention, consistent `{ success, data }` / `{ success, error }` response shape.

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Create account (email/password) |
| POST | `/auth/login` | Login, returns access token + refresh cookie |
| POST | `/auth/refresh` | Rotate access token |
| POST | `/auth/logout` | Clear refresh session |
| POST | `/auth/forgot-password` | Send reset link |
| POST | `/auth/reset-password` | Complete password reset |
| GET/PATCH | `/users/me` | Current user profile |
| GET/PATCH | `/business-profile` | Get/update sender business info + default signature |
| GET | `/clients` | List saved clients |
| POST | `/clients` | Create client |
| PATCH | `/clients/:id` | Update client |
| DELETE | `/clients/:id` | Archive client |
| GET | `/invoices` | List invoices (filter by document/payment status, paginated) |
| POST | `/invoices` | Create invoice (assigns invoice number) |
| GET | `/invoices/:id` | Get single invoice |
| PATCH | `/invoices/:id` | Update invoice (fields, document status, payment status) |
| DELETE | `/invoices/:id` | Soft-delete (move to trash) |
| POST | `/invoices/:id/restore` | Restore from trash |
| GET | `/invoices/trash` | List trashed invoices |
| GET | `/invoices/:id/download` | Generate and return PDF |
| POST | `/invoices/:id/send` | Email invoice to client |
| GET | `/templates` | List available templates |
| POST | `/billing/checkout` | Start Stripe checkout for Pro plan |
| GET | `/billing/portal` | Stripe customer portal link |

---

## 11. Non-Functional Requirements

- **Security:** JWT auth with short-lived access tokens, HttpOnly refresh cookies, ownership checks on every invoice/client query (users can only access their own data), input validation via Zod on every route.
- **Performance:** PDF generation under 3 seconds per invoice; dashboard list paginated (20 per page).
- **Reliability:** Trash purge job runs daily to permanently remove invoices past the 30-day window.
- **Compliance:** Privacy Policy and Terms of Service live at launch; card data never touches Billora's own servers (handled entirely by Stripe).

---

## 12. Pricing

| Plan | Price | Notes |
|---|---|---|
| Free Forever | $0 | Core invoicing features, likely capped invoice volume or watermark (to be defined) |
| Pro | $6/month | Full customization, unlimited invoices, client management (exact feature gating to be finalized), billed via Stripe |

---

## 13. Success Metrics

- Time from signup to first invoice sent (target: under 3 minutes).
- Weekly active invoice creators.
- Free-to-paid conversion rate.
- Invoice send/download completion rate (started vs. sent or downloaded).
- % of invoices marked Paid within their due date.

---

## 14. Open Questions

- Exact feature gating between Free and $6 tiers (invoice volume cap, template access, watermark on free tier?).
- Whether email verification is mandatory before first invoice creation.
- Exact meaning of the original "Changing value" customization item — confirmed here as line-item edits plus a manual total/discount override; revisit if a different meaning was intended.
- Whether proposals/external e-signature (someone other than the account owner signing) ship in v1 or a later phase.
- Full list of supported currencies — use a standard ISO 4217 list or a curated subset at launch.
- Whether automatic overdue detection (based on due date) should flip payment status automatically, or remain a manual toggle.