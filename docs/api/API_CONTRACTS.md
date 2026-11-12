# REST API Contracts — v1

> Base URL: `https://api.femurphysio.com/api/v1` (dev: `http://localhost:4000/api/v1`).
> Status: **contract design**. The frontend's `types/` folder and `services/api/*` live adapters follow this document. Once the backend exists, the source of truth becomes the generated OpenAPI spec (`/api/v1/docs`).

## Conventions

- JSON, `camelCase` fields. Timestamps are ISO-8601 UTC (`2026-11-12T04:30:00.000Z`). Business dates are `YYYY-MM-DD` (Asia/Dhaka).
- Money is `{ "amount": 150000, "currency": "BDT" }`, where **amount is in poisha** (৳1,500.00).
- Successful responses are `{ "data": …, "meta"?: { page, pageSize, total } }`.
- Errors use RFC 7807 problem details: `{ "type", "title", "status", "code": "SLOT_TAKEN", "detail", "errors"?: [{ field, message }] }`.
- Pagination: `?page=1&pageSize=20`. Sorting: `?sort=-startsAt`.
- Auth: session cookie `femur_sid` (httpOnly). Mutations require the `X-CSRF-Token` header to equal the `femur_csrf` cookie.
- Idempotency: `POST /appointments` and payment endpoints accept an `Idempotency-Key` header.
- Versioning: URI (`/api/v1`). Breaking changes go to `/api/v2`. Additive changes don't need a new version.

## Error codes (stable)

`VALIDATION_FAILED` · `UNAUTHENTICATED` · `FORBIDDEN` · `MEMBERSHIP_REQUIRED` · `QUOTA_EXCEEDED` · `NOT_FOUND` · `SLOT_TAKEN` · `SLOT_UNAVAILABLE` · `OUTSIDE_BOOKING_WINDOW` · `CANCELLATION_WINDOW_PASSED` · `INVALID_STATUS_TRANSITION` · `PROVIDER_NOT_CONFIGURED` · `RATE_LIMITED`

## Public (no auth)

| Method & path | Purpose |
| --- | --- |
| `GET /cms/pages/:key` | Published page with ordered sections (`home`, `about` (includes the Why Femur section), `our-story`, `pricing`, `contact`) |
| `GET /cms/settings` | Contact, opening hours, social links, announcement |
| `GET /cms/faqs?category=` | Published FAQs |
| `GET /cms/testimonials` | Published testimonials |
| `GET /services?kind=PHYSIOTHERAPY\|CONSULTANCY` | Active services, with `startingPrice` |
| `GET /services/:slug` | Service detail + related services + booking rules (public subset) |
| `GET /practitioners` | Public practitioner profiles + `availabilitySummary` (e.g. "Fridays, every 2 weeks") |
| `GET /pricing` | Published price items grouped by kind |
| `GET /membership-plans` | Public plans + benefits |
| `GET /availability/dates?serviceId&gender&from&to` | `[{ date, hasSlots }]` |
| `GET /availability/slots?serviceId&gender&date` | `[{ startsAt, endsAt, availableCount }]` |
| `POST /appointments/holds` | `{ serviceId, gender, startsAt }` → `{ holdId, expiresAt }` (5-min soft hold) |
| `POST /appointments` | Create a booking (see below) |
| `GET /appointments/by-reference/:ref` | Requires the session (owner) or `?phoneOtpToken` |
| `POST /contact-messages` | Contact form (rate-limited, captcha) |

### `POST /appointments`

```jsonc
// request
{
  "holdId": "h_01J…",                 // optional but recommended
  "serviceId": "svc_…",
  "startsAt": "2026-11-14T04:00:00.000Z",
  "patient": {                        // either an existing patientId (logged-in) or inline details
    "patientId": null,
    "fullName": "…", "gender": "FEMALE",
    "dateOfBirth": null, "ageYears": 34,
    "phone": "+8801XXXXXXXXX", "email": null,
    "relationship": "SELF"
  },
  "reasonForVisit": "Lower back pain for 2 weeks",
  "preferredPractitionerId": null     // honoured only if service.allowPractitionerChoice
}
// 201 response
{ "data": {
  "id": "apt_…", "reference": "FMR-7K2Q-9XPD", "status": "CONFIRMED",
  "service": { "id": "…", "name": "Physiotherapy" },
  "practitioner": { "id": "…", "displayName": "…" },
  "startsAt": "…", "endsAt": "…",
  "charge": { "listPrice": {…}, "discount": {…}, "net": {…}, "paymentStatus": "UNPAID" },
  "notifications": [{ "channel": "SMS", "status": "NOT_CONFIGURED" }]
}}
// 409 { "code": "SLOT_TAKEN" } → client refreshes slots
```

## Auth

| Method & path | Purpose |
| --- | --- |
| `POST /auth/register` | `{ fullName, phone, email?, password, gender, dateOfBirth? }` |
| `POST /auth/login` | `{ identifier (phone/email), password }` → sets cookie |
| `POST /auth/logout` | |
| `GET /auth/me` | `{ user, roles, permissions, membership: { status, planName, endsAt, entitlements } }` |
| `POST /auth/otp/request` · `POST /auth/otp/verify` | Phone verification / guest booking |
| `POST /auth/password/forgot` · `POST /auth/password/reset` | |

## Patient portal (role `PATIENT`)

| Method & path | Purpose |
| --- | --- |
| `GET/PATCH /me/profile` | |
| `GET/POST /me/patients` · `PATCH/DELETE /me/patients/:id` | Family/dependant profiles |
| `GET /me/appointments?scope=upcoming\|past` | |
| `POST /me/appointments/:id/cancel` | Enforces the cancellation cut-off |
| `POST /me/appointments/:id/reschedule` | `{ startsAt }`, same engine as booking |
| `GET /me/membership` · `POST /me/memberships` (`{ planId, paymentMethod }`) | Purchase → payment intent |
| `GET /me/payments` | |
| `GET /me/notifications` · `POST /me/notifications/:id/read` | |

## Admin (roles `RECEPTIONIST`/`ADMIN`/`SUPER_ADMIN`; permission noted)

| Method & path | Permission |
| --- | --- |
| `GET /admin/dashboard?from&to` | `dashboard.view` |
| `GET /admin/calendar?date&view=day\|week&practitionerIds&serviceId` → `{ practitioners, appointments, blocks, availability }` | `calendar.view` |
| `POST /admin/appointments` (walk-in / phone; may override gender policy with a reason) | `appointments.create` |
| `PATCH /admin/appointments/:id/status` `{ to, reason }` | `appointments.update_status` |
| `POST /admin/appointments/:id/reschedule` `{ startsAt, practitionerId? }` | `appointments.reschedule` |
| `POST /admin/appointments/:id/assign` `{ practitionerId, kind: ASSIGNED\|TREATING }` | `appointments.assign` |
| `POST /admin/time-blocks` · `DELETE /admin/time-blocks/:id` | `schedules.manage` |
| `GET /admin/patients?q=` · `GET /admin/patients/:id` · `POST /admin/patients` (walk-in) | `patients.view` / `patients.create` |
| `GET/POST /admin/patients/:id/notes` | `patients.notes` (internal) · `clinical_notes.*` (clinical) |
| `CRUD /admin/practitioners` · `PUT /admin/practitioners/:id/availability-rules` · `POST /admin/practitioners/:id/exceptions` | `practitioners.manage` |
| `CRUD /admin/services` | `services.manage` |
| `CRUD /admin/price-items` · `CRUD /admin/membership-plans` | `pricing.manage` |
| `GET /admin/memberships` · `POST /admin/memberships/:id/{activate,suspend,resume,cancel}` | `memberships.manage` |
| `GET /admin/payments` · `POST /admin/payments` (cash/manual) · `POST /admin/payments/:id/verify` · `POST /admin/payments/:id/refunds` | `payments.manage` |
| `CRUD /admin/commission-rules` | `commissions.manage` |
| `GET /admin/commissions?practitionerId&from&to&status&serviceId` | `commissions.view` |
| `POST /admin/commissions/:id/override` `{ amount, reason }` | `commissions.override` (SUPER_ADMIN) |
| `POST /admin/commission-settlements` | `commissions.settle` |
| `CRUD /admin/cms/pages/:key/sections`, `/admin/cms/faqs`, `/testimonials`, `/announcements`, `/settings`, `POST /admin/cms/media` | `cms.manage` |
| `GET /admin/reports/:report?from&to&format=csv` | `reports.view` |
| `GET /admin/audit-logs` | `audit.view` (SUPER_ADMIN) |

## Nira (entitlement `nira.access`)

| Method & path | Purpose |
| --- | --- |
| `GET /nira/access` | `{ allowed, reason: NOT_AUTHENTICATED\|NO_MEMBERSHIP\|EXPIRED\|SUSPENDED, quota }` |
| `GET/POST /nira/conversations` · `DELETE /nira/conversations/:id` | |
| `POST /nira/conversations/:id/messages` | `text/event-stream` streaming response |
