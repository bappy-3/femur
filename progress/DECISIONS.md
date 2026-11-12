# Architecture Decision Records

### ADR-001 — Separate apps in one repository, no monorepo tooling
**Decision:** `frontend/`, `backend/` and `nira/` are independent apps, each with its own `package.json`, lockfile and deploy. There are no npm workspaces, Turborepo or Nx.
**Why:** this was a project requirement, and it keeps deploys independent and simple.
**Trade-off:** types can't be shared as a package. Mitigated by generating client types from the backend's OpenAPI spec (ADR-006).

### ADR-002 — Next.js 15.5 (not 16)
**Decision:** Next.js 15.5 with React 19.
**Why:** Next 16 requires Node ≥ 20.9, and the dev machines run macOS 12/13 with Node 18. Next 15 is still current and supported.
**Revisit:** when the team moves to Node 20+.

### ADR-003 — Modular monolith backend (NestJS)
**Decision:** one NestJS service with strict feature modules and domain events.
**Alternatives:** microservices. Rejected as premature for a single clinic, and it adds ops cost.

### ADR-004 — Admin portal inside the main frontend app
**Decision:** `/admin` lives in `frontend/` under the `(admin)` route group, not in a separate app.
**Why:** it shares the design system, types and API client. Security comes from backend RBAC, not app separation. Route groups keep the admin JS out of public bundles.
**Revisit:** if admin dependencies grow large or need a separate release cadence.

### ADR-005 — Adapter-based data layer with a mock adapter
**Decision:** all I/O goes through `services/` using the `FemurApi` interface. `NEXT_PUBLIC_API_MODE` selects `live` or `mock`.
**Why:** this let us build and review the full UI before the backend exists, without scattering fake data through components. Mock data is visibly labelled, and `DEPLOY_ENV=production` blocks mock builds.
**Trade-off:** mock state lives per JS runtime (server vs browser tab), so CMS edits made in the browser don't appear on server-rendered pages in mock mode.

### ADR-006 — API types: hand-written now, generated later
**Decision:** for now, `frontend/types/` mirrors `docs/api/API_CONTRACTS.md` by hand. Once the backend exposes OpenAPI, we'll generate types with `openapi-typescript`.

### ADR-007 — Double-booking prevention at the database level
**Decision:** a PostgreSQL exclusion constraint on `(practitioner, tstzrange)` for active statuses, plus a transaction, a Redis hold (UX) and an idempotency key.
**Why:** application checks alone are race-prone, and the database guarantee is absolute.

### ADR-008 — Tailwind CSS 3.4 instead of 4
**Decision:** use Tailwind 3.4.17 with a JS config.
**Why:** Tailwind 4's native engine (`@tailwindcss/oxide-*`) declares `node >= 20`, so npm skips it on Node 18. 4.3.4+ also requires the ESM-only `magic-string@1`. Both errors were reproduced on the dev machine.
**Revisit:** migrate with `@tailwindcss/upgrade` once on Node 20+. The class names used are largely v4-compatible.

### ADR-009 — Deterministic formatting instead of Intl
**Decision:** dates, times and money are formatted by hand from Asia/Dhaka wall-clock parts (`lib/datetime.ts`, `lib/money.ts`).
**Why:** Intl output differs between Node's ICU and browsers. This caused a real hydration mismatch in the calendar header. Hand-rolled formatting is also always in the clinic's time zone, whatever the visitor's device zone.

### ADR-010 — Money in poisha, time in UTC + Asia/Dhaka business dates
**Decision:** integer poisha everywhere, `timestamptz` instants, and `date` business days.
**Why:** avoids float drift and timezone bugs.

### ADR-011 — Gender policy and booking rules are per-service configuration
**Decision:** `genderPolicy`, `bookingMode`, lead time, window, cancellation cut-off and eligible genders are fields on each service, editable in admin.
**Why:** the business hasn't confirmed every rule (Q1–Q7), and configuration avoids hard-coding guesses.

### ADR-012 — Practitioner placeholders, not stock faces
**Decision:** practitioners use neutral names ("Physiotherapist A") and monogram avatars until real profiles are supplied.
**Why:** stock photos of strangers presented as staff would misrepresent the clinic.

### ADR-013 — Nira is linked, not embedded
**Decision:** every "Ask Nira" CTA links to `https://nira.femurphysio.com`, and `/nira` redirects there. Membership gating happens in the Nira app and backend.
