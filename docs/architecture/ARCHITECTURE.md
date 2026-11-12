# Femur Platform — System Architecture

> **Audience:** engineers joining the Femur project (frontend, backend, DevOps).
> **Status:** Architecture approved for implementation. Frontend is being built (Phase 3 in progress). Backend, database and Nira are **designed but not yet implemented**.
> **Last updated:** 2026-11-12

This is the master architecture document. The detailed companion documents are:

| Topic | Document |
| --- | --- |
| Database design (entities, constraints, indexes) | [`docs/database/DATA_MODEL.md`](../database/DATA_MODEL.md) |
| REST API contracts (v1) | [`docs/api/API_CONTRACTS.md`](../api/API_CONTRACTS.md) |
| Frontend conventions & folder rules | [`docs/architecture/FRONTEND.md`](./FRONTEND.md) |
| Booking & scheduling engine | [`docs/architecture/BOOKING_ENGINE.md`](./BOOKING_ENGINE.md) |
| Membership, payments & commissions | [`docs/architecture/MEMBERSHIP_AND_COMMISSIONS.md`](./MEMBERSHIP_AND_COMMISSIONS.md) |
| Deployment topology | [`docs/deployment/DEPLOYMENT.md`](../deployment/DEPLOYMENT.md) |
| Decision records | [`progress/DECISIONS.md`](../../progress/DECISIONS.md) |

---

## 1. What we are building

Femur Physiotherapy & Wellness Center (Uttara, Dhaka) needs a platform, not a brochure site:

1. **Public website**: physiotherapy first, with consultancy services second. All content is managed through the CMS.
2. **Appointment booking**: gender-aware practitioner matching, real availability, and no double booking.
3. **Patient portal**: free accounts, family profiles, appointment history, and memberships.
4. **Admin portal**: an operational control centre built around a slot-based, resource-column calendar.
5. **Membership engine**: plans, entitlements, renewals and manual or online payments.
6. **Commission engine**: per-practitioner commissions that keep their history.
7. **Nira**: Femur's members-only consultant, deployed separately at `nira.femurphysio.com`. The main site has a `/nira` gateway page that asks visitors to log in and checks for an active membership before linking to the app.

### Guiding principles

| # | Principle | Practical consequence |
| --- | --- | --- |
| P1 | **The backend is the source of truth** | Availability, prices, membership access and commissions are always computed server-side. The frontend only displays them. |
| P2 | **Separate apps, not a monorepo** | `frontend/`, `backend/` and `nira/` each have their own `package.json`, lockfile, build and deploy. No workspaces, Turborepo or Nx. |
| P3 | **Modular monolith backend** | One NestJS service with strict module boundaries. We split into microservices only if load or team size proves it necessary. |
| P4 | **Nothing business-editable is hardcoded** | Prices, services, practitioners, hours, contact details, FAQs and hero copy all come from the CMS/API. |
| P5 | **Honest integrations** | Payment, SMS, email, WhatsApp and LLM providers sit behind interfaces. An unconfigured provider reports `NOT_CONFIGURED`. It never reports a fake success. |
| P6 | **Privacy by default** | No patient data in URLs or notification bodies, field-level access control on clinical notes, and audit logs on sensitive actions. |
| P7 | **Performance is a feature** | Server Components by default, small client islands, optimised images and fonts. Target Lighthouse ≥ 90 on mobile. |

---

## 2. System context

```text
                         ┌──────────────────────────────────────────────┐
  Patients / visitors    │  femurphysio.com      (frontend/ — Next.js)   │
  Receptionists ───────▶ │   public site · booking · /account · /admin   │
  Admins                 └───────────────┬──────────────────────────────┘
                                         │ HTTPS  /api/v1  (cookie session)
  Members ──────────────▶ nira.femurphysio.com (nira/ — Next.js, Phase 8)
                                         │
                         ┌───────────────▼──────────────────────────────┐
                         │  api.femurphysio.com  (backend/ — NestJS)     │
                         │  modular monolith · REST v1 · RBAC · audit    │
                         └──┬──────────┬───────────┬───────────┬────────┘
                            │          │           │           │
                     PostgreSQL     Redis      Object store   Workers (BullMQ)
                     (Prisma)    (locks, cache,  (S3-compatible:  reminders, expiry,
                                  rate limits,   images, docs)    notifications,
                                  queues)                         commission jobs
                                                     │
                     External providers (behind adapters, all optional):
                     bKash · Nagad · SSLCommerz/other gateway · SMS (BD) ·
                     Email (SMTP/SES) · WhatsApp Cloud API · LLM provider
```

**Domains and subdomains**

| Host | App | Notes |
| --- | --- | --- |
| `femurphysio.com` | `frontend/` | Public site, booking, patient portal (`/account`), admin portal (`/admin`) |
| `nira.femurphysio.com` | `nira/` | Separate Next.js app. Same backend, same auth cookie (scoped to `.femurphysio.com`) |
| `api.femurphysio.com` | `backend/` | REST API, versioned under `/api/v1` |
| `cdn.femurphysio.com` *(optional)* | Object storage + CDN | Media uploaded through the CMS |

> **Why is `/admin` inside the main frontend and not on a separate app?** It shares the design system, types and API client, and it is protected by the same auth cookie and backend RBAC. A separate `admin.` app would duplicate all of that with no security gain, because authorisation lives in the backend anyway. We can extract it later if the admin bundle starts affecting the public site. Route groups already keep the two bundles separate. See ADR-004.

---

## 3. Repository layout

```text
femur/
├── frontend/          # Next.js 15 (App Router) — public site, booking, portals
├── backend/           # NestJS 11 + Prisma + PostgreSQL          (Phase 2+, not yet created)
├── nira/              # Next.js app for nira.femurphysio.com     (Phase 8, not yet created)
├── docs/
│   ├── architecture/  # this file + FRONTEND, BOOKING_ENGINE, MEMBERSHIP_AND_COMMISSIONS
│   ├── database/      # DATA_MODEL.md
│   ├── api/           # API_CONTRACTS.md
│   └── deployment/    # DEPLOYMENT.md
├── progress/          # PROJECT_STATUS, DEVELOPMENT_LOG, TASK_TRACKER, DECISIONS, KNOWN_ISSUES
├── README.md
├── .gitignore
└── .env.example       # index of env files; each app owns its own .env.example
```

Each application:

- has its own `package.json`, lockfile, `tsconfig`, lint config and `.env.example`;
- is installed, built, tested and deployed **independently** (`cd frontend && npm ci && npm run build`);
- shares **contracts, not code**. API types live in each consumer, generated from the backend's OpenAPI spec once the backend exists (ADR-006). Until then, `frontend/types/` mirrors `docs/api/API_CONTRACTS.md` by hand.

---

## 4. Frontend architecture (`frontend/`)

Full conventions: [`FRONTEND.md`](./FRONTEND.md). Summary:

### 4.1 Stack

| Concern | Choice | Reason |
| --- | --- | --- |
| Framework | **Next.js 15.5** (App Router), React 19 | Next 16 needs Node ≥ 20.9. The team's development machines run macOS 12 / Node 18 (ADR-002). |
| Language | TypeScript (strict) | |
| Styling | Tailwind CSS **v3.4** with design tokens in `tailwind.config.ts` + CSS variables in `app/globals.css` | No runtime CSS-in-JS cost. v4's native engine requires Node ≥ 20 (ADR-008). |
| Motion | `motion` (Motion for React), used only in client islands (booking wizard, mobile nav). Scroll reveals use a tiny IntersectionObserver + CSS. | Keeps the JS budget small |
| Icons | `lucide-react` (tree-shaken per icon) | |
| Validation | `zod` (form schemas, mirrors backend DTOs) | |
| Fonts | `next/font/google`: **Fraunces** (display serif) + **Manrope** (UI sans), self-hosted and preloaded | No layout shift, no third-party font requests |
| Date/number formatting | Hand-rolled, deterministic (`lib/datetime.ts`, `lib/money.ts`). No `Intl` in render paths. | Node's ICU and browsers format differently, which causes hydration mismatches (ADR-009) |
| Tests | Vitest for pure logic (date/time, slot math, calendar layout, wizard reducer) | |

### 4.2 Route map (route groups)

```text
app/
├── (public)/            SiteHeader + SiteFooter chrome; Server Components; ISR
│   ├── page.tsx                     /                 Homepage
│   ├── about/                       /about
│   ├── our-story/                   /our-story
│   ├── why-femur/                   /why-femur  (redirects to /about#why-femur)
│   ├── nira/                        /nira  (members-only gateway: login / become a member / open Nira)
│   ├── services/ , services/[slug]  /services, /services/physiotherapy …
│   ├── specialists/                 /specialists
│   ├── pricing/                     /pricing
│   ├── membership/                  /membership
│   ├── faq/                         /faq
│   └── contact/                     /contact
├── (booking)/booking/   Minimal focused chrome — /booking  (7-step wizard)
├── (auth)/              /login /register /forgot-password
├── (patient)/account/   /account, /account/appointments, /membership, /family, /payments, /profile
└── (admin)/admin/       /admin (dashboard), /admin/calendar, /appointments, /patients[/id],
                         /practitioners[/id], /services, /pricing, /cms, /finance
```

`/nira` is a **gateway page** on the main site. Every "Ask Nira" CTA links to it. Logged-out visitors are asked to log in (`/login?next=/nira`), logged-in users without an active membership are sent to *Become a member*, and active members get an *Open Nira* button to `NEXT_PUBLIC_NIRA_URL`. This page is a convenience: the Nira app and backend still check membership on every request.

### 4.3 Layers (dependency direction ↓ only)

```text
app/ (routes, layouts, metadata)          ← composes pages; no business logic
  └─ features/<domain>/                   ← feature UI + hooks + local state + schemas
       └─ components/ (ui, layout, sections, navigation)   ← presentational, reusable
       └─ services/ (data access: api client + adapters)   ← the ONLY place that talks HTTP
            └─ lib/ (pure utils: datetime, money, cn)  · types/ (API contracts) · config/
```

Rules:

- `components/` must not import from `features/` or `services/`.
- Only `services/` performs network I/O. Pages and features call `api.<domain>.<method>()`.
- `services/index.ts` selects the **adapter** from `NEXT_PUBLIC_API_MODE`:
  - `live`: real HTTP to `NEXT_PUBLIC_API_URL/api/v1` (`services/api/*`);
  - `mock`: in-memory adapters built on clearly labelled **sample fixtures** (`services/mock/*`). These exist so the UI can be built and reviewed before the backend exists. While mock mode is active, the UI shows a visible "Demo data" notice. **Mock mode must never be enabled in production.** `next.config.ts` aborts the build when `DEPLOY_ENV=production` and `NEXT_PUBLIC_API_MODE` is not `live`.

### 4.4 Rendering & caching strategy

| Area | Strategy |
| --- | --- |
| Public marketing pages | Server Components with `fetch(..., { next: { revalidate: 300, tags: ['cms'] } })`. The backend calls `POST /api/revalidate` (secret-protected) after a CMS publish, which runs `revalidateTag`. |
| Service detail pages | `generateStaticParams` from the services list plus ISR |
| Booking wizard | Client island. Availability is fetched live with no cache. |
| Patient & admin portals | Dynamic (`cookies()`), no caching, `noindex` |
| Images | `next/image`, AVIF/WebP, explicit `sizes`, `priority` only on the hero image |

### 4.5 Auth on the frontend

- The backend issues an **httpOnly, Secure, SameSite=Lax** session cookie scoped to `.femurphysio.com`, so the main site and Nira share one login.
- `middleware.ts` only checks that the cookie exists for `/account/*` and `/admin/*` and redirects to `/login?next=…`. It does **not** decide roles.
- Portal layouts call `GET /api/v1/auth/me` on the server and render a 403 state if the role is insufficient. The backend still enforces RBAC on every endpoint, so frontend checks are a UX convenience only.
- Mutations send the CSRF token (double-submit cookie `femur_csrf` → `X-CSRF-Token` header).

---

## 5. Backend architecture (`backend/`, planned)

NestJS modular monolith with feature modules. Each module contains:

```text
modules/appointments/
├── appointments.module.ts
├── controllers/   appointments.controller.ts, admin-appointments.controller.ts
├── services/      appointments.service.ts, appointment-lifecycle.service.ts
├── dto/           create-appointment.dto.ts, reschedule-appointment.dto.ts …
├── domain/        appointment-status.ts (state machine), policies/
├── repositories/  appointments.repository.ts (Prisma access, no business rules)
├── events/        appointment-booked.event.ts …
└── tests/         *.spec.ts
```

| Module | Responsibility |
| --- | --- |
| `auth` | Registration, login, sessions, password reset, OTP (phone), CSRF |
| `users` | Accounts, roles, permissions |
| `patients` | Patient profiles (self and family/dependants), clinical notes (restricted) |
| `practitioners` | Profiles, gender, services offered, commission profile |
| `services` | Service catalogue, categories, booking rules |
| `schedules` | Availability rules, exceptions, blocked time, **slot generation** |
| `appointments` | Booking, holds, assignment, lifecycle, status history |
| `pricing` | Price lists, packages, offers, effective-dated prices |
| `memberships` | Plans, subscriptions, entitlements (`nira.access`, discounts …) |
| `payments` | Payment intents, provider adapters (bKash, Nagad, gateway, cash, manual), refunds |
| `commissions` | Rules, per-appointment commission snapshots, overrides, settlements |
| `notifications` | Templates, channel adapters (email, SMS, WhatsApp), delivery log |
| `cms` | Pages, sections, testimonials, FAQs, announcements, SEO, media |
| `analytics` | Read models and reports, CSV export |
| `nira` | Conversation storage, LLM gateway, quotas, safety policy |
| `audit` | Append-only audit log |

Cross-cutting (`src/common`, `src/guards`, `src/interceptors`, `src/decorators`):

- `SessionGuard` → `RolesGuard` / `PermissionsGuard` (`@RequirePermission('appointments.reschedule')`) → `EntitlementGuard` (`@RequireEntitlement('nira.access')`);
- global `ValidationPipe` (whitelist, forbidNonWhitelisted);
- a response envelope interceptor and a problem-details exception filter (see the API contracts);
- request-id + structured logging (pino), and an audit interceptor for `@Audited()` handlers;
- rate limiting (`@nestjs/throttler` with Redis storage).

Inter-module communication uses **service calls inside the monolith** and **domain events** (`@nestjs/event-emitter`) for side effects. For example, `AppointmentCompleted` triggers a commission snapshot and a notification.

---

## 6. Data model (summary)

Full design with columns, constraints and indexes: [`DATA_MODEL.md`](../database/DATA_MODEL.md).

```text
User ─1:1─ Patient(self) ─┐                 Role ─< RolePermission >─ Permission
  └─1:N─ Patient(dependants)                User ─< UserRole >─ Role
Practitioner ─< PractitionerService >─ Service ─> ServiceCategory
Practitioner ─< AvailabilityRule , AvailabilityException, TimeBlock
Appointment ─> Patient, Service, Practitioner(assigned), Practitioner(treating)
Appointment ─< AppointmentStatusHistory
Appointment ─1:1─ AppointmentCharge ─< Payment ─< Refund
Appointment ─1:1─ PractitionerCommission ─> CommissionRule(snapshot) ─> CommissionSettlement
MembershipPlan ─< PlanEntitlement ;  Membership ─> Plan, User ;  Membership ─< MembershipTransaction
Conversation ─< Message (Nira) ; NiraUsage
CMS: Page ─< Section ; Testimonial ; Faq ; Announcement ; MediaAsset ; SiteSetting
Notification ─< NotificationDelivery ; NotificationTemplate
AuditLog
```

Key integrity rules:

1. **No double booking.** A PostgreSQL **exclusion constraint** on `(practitioner_id, tstzrange(starts_at, ends_at))` applies to `active` appointment statuses (`btree_gist`). The database rejects any overlap, even if application logic has a bug.
2. **Commission history is immutable.** A completed appointment's commission stores a *snapshot* (rule id, type, rate, base amount, computed amount). Rule changes never touch existing rows.
3. **Effective dating.** `CommissionRule`, `Price` and `AvailabilityRule` have `effective_from` and `effective_to`, so we never edit in place.
4. **Money** is stored as integer **poisha** (`BIGINT`, 1 BDT = 100 poisha). We never use floating point.
5. **Time** is stored as `timestamptz` (UTC). Business logic runs in `Asia/Dhaka` (UTC+06:00, no DST). Date-only concepts use the `date` type and are interpreted in Dhaka.

---

## 7. Booking & scheduling engine (summary)

Full design: [`BOOKING_ENGINE.md`](./BOOKING_ENGINE.md).

**Availability model.** Practitioners can work very different patterns, so availability is **rule-based**:

| Rule kind | Example |
| --- | --- |
| `WEEKLY` | Physiotherapist works Sat–Thu, 09:00–13:00 and 15:00–20:00 |
| `EVERY_N_WEEKS` | Eye specialist every 2nd Friday, from an anchor date, 16:00–19:00 |
| `MONTHLY_NTH_WEEKDAY` | Dentist on the 1st and 3rd Friday of each month |
| `SPECIFIC_DATE` | Nutritionist visiting on 2026-12-05, 10:00–14:00 |
| `AvailabilityException` | Leave or holiday (removes availability) or an extra session (adds it) |
| `TimeBlock` | Admin-blocked time, e.g. equipment maintenance or a meeting |

**Slot generation** for `(service, patientGender, date)`:

1. Find candidate practitioners. They must be active, offer the service and pass the service's **gender policy**: `REQUIRED_SAME_GENDER` (default for physiotherapy), `PREFERRED`, or `NONE` (typical for dental and eye care). The policy is configurable per service.
2. Expand availability rules into working intervals for that Dhaka date. Then subtract breaks, exceptions, blocks, existing active appointments and active Redis holds.
3. Step through each interval in increments of the service duration plus the practitioner's buffer. Apply the booking window (minimum lead time and maximum days ahead).
4. Return slots as `{ startsAt, endsAt, availableCount }`. Practitioner identities are not exposed unless the service allows patients to choose a practitioner.

**Booking transaction:**

```text
POST /appointments/holds      → Redis SET NX "hold:{practitioner}:{start}" TTL 5 min  (soft lock, UX)
POST /appointments            → BEGIN
                                  re-verify slot against rules (server truth)
                                  choose practitioner (auto-assign: least-loaded that day, stable tie-break)
                                  INSERT appointment (exclusion constraint = hard guarantee)
                                  INSERT status_history, charge
                                COMMIT → emit AppointmentBooked → notification jobs
                                on 23P01 (exclusion violation) → 409 SLOT_TAKEN, client refreshes slots
```

**Lifecycle (state machine):**

```text
PENDING ──confirm──▶ CONFIRMED ──check-in──▶ IN_PROGRESS ──complete──▶ COMPLETED
   │  └─reject──▶ REJECTED        │  └─no-show──▶ NO_SHOW
   └──cancel──▶ CANCELLED ◀───────┘   reschedule = new time on same record + history row
```

Whether a booking starts as `PENDING` or auto-`CONFIRMED` is a per-service booking rule.

---

## 8. Identity, roles & access

**Authentication ≠ membership.** A *role* says who you are (staff or patient). An *entitlement* says what your membership currently unlocks.

| Role | Typical permissions |
| --- | --- |
| `PUBLIC` | Read the published CMS, services, prices and slot availability. Create a guest booking (phone OTP, see the open questions). |
| `PATIENT` (registered user) | Manage own profile and dependants, book, cancel or reschedule within policy, buy a membership |
| `PRACTITIONER` | View own schedule, mark completion, write clinical notes for own patients |
| `RECEPTIONIST` | Calendar, bookings, walk-ins, payments (cash/manual), patient search. **No** clinical notes or commission edits. |
| `ADMIN` | Everything operational: services, pricing, CMS, practitioners, reports, commission settlement |
| `SUPER_ADMIN` | Admin plus role management, commission overrides, system settings, audit log access |

Membership states: `NONE` (free user) · `ACTIVE` · `EXPIRED` · `SUSPENDED` · `CANCELLED` · `PENDING_PAYMENT`.
Entitlements come from the active plan (`nira.access`, `nira.dailyMessages=50`, `discount.physio=10%` …). They are checked by `EntitlementGuard` **on every request**, and `ends_at` is compared to `now()`. Expiry therefore revokes access immediately, with no reliance on a cron job.

Session: opaque session id in an httpOnly cookie, sessions stored in Postgres or Redis, rotated on login and privilege change, idle timeout 30 min for staff and 7 days for patients. Passwords are hashed with **argon2id**. Login and OTP endpoints are rate-limited.

---

## 9. Membership, payments & commission (summary)

Full design: [`MEMBERSHIP_AND_COMMISSIONS.md`](./MEMBERSHIP_AND_COMMISSIONS.md).

- **Payments** use one `PaymentProvider` interface with `createIntent`, `verify`, `refund` and `handleWebhook`. Adapters: `cash`, `manual` (staff verifies a bKash/Nagad transaction id), `bkash`, `nagad`, `gateway` (e.g. SSLCommerz). Online adapters ship **disabled** until credentials exist.
- **Commissions** are resolved by the most specific matching rule, in this order:
  1. practitioner + service;
  2. practitioner;
  3. service;
  4. the clinic default.

  The rule effective on the appointment date applies. The commission is calculated when the appointment is `COMPLETED` **and** the payment condition is met. It is computed for the **treating** practitioner and stored as a snapshot. Overrides need a reason and write an audit log entry. Settlements group payable commissions per practitioner per period.

---

## 10. Nira integration (summary)

- `nira/` is a separate Next.js app on `nira.femurphysio.com`, built in Phase 8.
- It uses the shared session cookie. Every chat request goes to `POST /api/v1/nira/conversations/:id/messages`, which checks the session, the `nira.access` entitlement and the quota (Redis token bucket), then streams the reply (SSE).
- An `LlmProvider` interface (`streamChat`) has adapters chosen by environment configuration. Keys are only ever stored on the server.
- A safety layer handles the system policy (no diagnosis or prescriptions, escalate emergencies), red-flag keyword routing to an emergency message, and PII minimisation. Nira can only read the *requesting user's* own appointment summary, and only through explicit tools.
- The main site links to Nira only. Everything else lives in the Nira app.

---

## 11. Notifications

`NotificationService.dispatch(event, recipient, data)` renders the admin-editable template for each enabled channel and enqueues a BullMQ job per channel. Each job records a `NotificationDelivery` row with status `QUEUED → SENT | FAILED | NOT_CONFIGURED`.
Message bodies contain the minimum needed: the date, time, reference and clinic phone number. They contain **no diagnosis or reason for visit**.
Scheduled jobs send the 24h and 2h appointment reminders, and the membership expiry warnings at 7d, 1d and on expiry.

---

## 12. Security & privacy checklist

- OWASP ASVS L2 as the baseline: validation DTOs on every input, parameterised queries (Prisma), output encoding (React), strict CSP, HSTS, and `X-Frame-Options: DENY` (except the Maps iframe origin).
- Appointment URLs use an opaque **reference** (`FMR-7K2Q-9XPD`) and never a patient name or phone number. Confirmation pages need the session or reference + phone OTP.
- Clinical notes are a separate table. Only treating practitioners and admins can access them, and every read is audited.
- Uploaded documents go to a private bucket with short-lived signed URLs.
- Secrets live only in server-side environment variables. The frontend only receives `NEXT_PUBLIC_*` values, which are never secret.
- Backups: daily PostgreSQL base backup plus WAL archiving (PITR). Restore is tested monthly.

---

## 13. Performance budget (frontend)

| Metric | Budget |
| --- | --- |
| LCP (mobile, 4G) | < 2.0 s |
| CLS | < 0.05 |
| INP | < 200 ms |
| First-load JS, public pages | < 120 kB gzip |
| Hero image | AVIF, `priority`, `sizes` set; everything else lazy |

---

## 14. Risks & mitigations

| Risk | Mitigation |
| --- | --- |
| Double booking under concurrency | DB exclusion constraint + transaction + Redis hold; concurrency test in Phase 9 |
| Irregular specialist schedules modelled badly | Rule kinds above + exceptions; admin preview of the next 8 weeks of generated sessions |
| Gender-matching rule applied where the business doesn't want it | Per-service policy, defaulted by category; confirm with Femur (open question Q1) |
| Payment provider onboarding delays (bKash/Nagad merchant accounts) | Manual verification flow works from day one |
| Commission disputes | Immutable snapshots, overrides with reason + audit trail, exportable reports |
| Node 18 on dev machines (macOS 12) | Next 15 / Nest 11 / Prisma 6 all support Node 18.18+. Production runs Node 20 LTS in Docker. |
| LLM safety / liability | Policy layer, red-flag routing, disclaimers, no clinical data access, logging for review |

---

## 15. Open business questions (need Femur's decision)

These change workflows, so the defaults below are **configurable** and not hard-wired:

| # | Question | Current default |
| --- | --- | --- |
| Q1 | Does the same-gender rule apply to consultancy services (dental, eye, nutrition, general medicine)? | Physiotherapy family = `REQUIRED_SAME_GENDER`; consultancy = `NONE` |
| Q2 | Should bookings be auto-confirmed, or reviewed by reception first? | Per service. Physiotherapy = auto-confirm; visiting specialists = `PENDING` |
| Q3 | Can guests book without an account (phone OTP), or is login required? | Guest booking allowed with phone verification |
| Q4 | Is payment taken at booking (online) or at the clinic? | Pay at clinic; online prepayment optional per service |
| Q5 | Commission base: gross fee, or fee after discount? Do membership discounts reduce the base? | Fee **after** discount |
| Q6 | Cancellation policy: cut-off time and whether a fee applies | Free cancellation up to 6 h before; configurable |
| Q7 | Can patients choose a specific practitioner? | No for physiotherapy (auto-assign); yes for consultancy (usually one specialist) |

---

## 16. Roadmap

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Architecture & planning (this documentation) | ✅ Done |
| 2 | Foundation (frontend scaffold done; backend scaffold pending) | 🟡 Frontend part done |
| 3 | Public website + design system + CMS-ready data layer | 🟡 In progress (mock data) |
| 4 | Auth & patient portal (UI built against contracts; backend pending) | 🟡 UI only |
| 5 | Booking & scheduling engine (wizard UI + mock engine; server engine pending) | 🟡 UI only |
| 6 | Admin portal incl. resource calendar (UI against mock adapter) | 🟡 UI only |
| 7 | Membership & commission (backend) | ⏳ Pending |
| 8 | Nira app | ⏳ Pending |
| 9 | Testing & optimisation | ⏳ Pending |
| 10 | Production readiness | ⏳ Pending |

See [`progress/PROJECT_STATUS.md`](../../progress/PROJECT_STATUS.md) for the live status.
