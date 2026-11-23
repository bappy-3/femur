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

### ADR-013 — Nira: members-only consultant, reached through a gateway page
**Decision:** every "Ask Nira" CTA links to `/nira` on the main site. That page asks visitors to log in, sends non-members to *Become a member*, and only shows *Open Nira* (→ `nira.femurphysio.com`) to active members. Public copy calls Nira the **AI Consultant**; it has a mascot (an otter in a white coat, `public/nira-mascot.jpg`).
**Why:** the clinic describes Nira as a members-only consultant. The gateway page is a UX convenience only; the Nira app and backend must still verify the session and entitlement on every request.
**Confirmed:** Nira is an AI Consultant, members only, so the backend `nira` module design (LLM gateway, quotas, safety policy) stands.

### ADR-014 — "Why Femur" merged into About
**Decision:** the separate Why Femur page and nav tab are removed. The content is a section (`#why-femur`) on `/about`, and `/why-femur` redirects there.

### ADR-015 — "Become a Member" is a top-level navigation item
**Decision:** the nav links to `/membership` with the label *Become a Member*, so membership and the members-only Nira are easy to find.

### ADR-016 — Photographic page chrome and domain readiness
**Decision:** page heroes, CTA bands and panels use photography (via `config/brand.ts`) rather than flat colour blocks. SEO and social files (`robots.ts`, `sitemap.ts`, `opengraph-image.tsx`, canonical metadata, JSON-LD) are generated from `NEXT_PUBLIC_SITE_URL`, and `www` redirects to the apex domain.

### ADR-017: Content library as typed TypeScript modules
**Decision:** conditions, treatments and articles live in `frontend/content/*.ts` with shared types in `types/content.ts`, rendered as static pages. They are *not* routed through the mock `api` adapter.
**Why:** the content is editorial, changes rarely, benefits from SSG and needs no backend. Types make later migration to the CMS API a one-line change per page.
**Trade-off:** edits need a code change until the admin CMS covers these types.

### ADR-018: Bilingual by secondary line, not by locale routing (for now)
**Decision:** English is primary. Bangla appears as a secondary line (names, summaries, a summary box per condition, hero tagline) using `<Bn lang="bn">` and Noto Sans Bengali.
**Why:** delivers a visible, correct Bangla presence quickly without duplicating every page or breaking ISR/static caching (a cookie-based toggle would make pages dynamic).
**Follow-up:** full translation needs `/bn` locale routing and translated bodies, FAQs and articles.

### ADR-019: Competitor research informs topics, never copy
**Decision:** competitor pages are used to find topics and page types. No text, images, branding, names or contact details are reused; unverified medical claims are not repeated. All medical copy is hedged, includes red-flag guidance and requires clinician sign-off.
**Why:** copyright and SEO duplicate-content risk, patient safety, and brand integrity.

### ADR-020: Maternal care is Femur's primary positioning
**Decision:** Femur is presented first and foremost as a women's and maternal physiotherapy clinic serving women before, during and after pregnancy. The homepage hero, navigation (*Maternal Care* is the first item), service ordering, conditions, articles, testimonials and FAQ lead with maternal content; general musculoskeletal care follows.
**Implementation:** three stages (pre-pregnancy, pregnancy, postnatal) plus pelvic floor therapy become four bookable services (`eligibleGenders: [FEMALE]`, required same-gender), and a `/maternal-care` hub page. The slug `pregnancy-rehabilitation` was kept (renamed *Pregnancy Physiotherapy*) so existing links, tests and seed data stay valid.
**Why:** the clinic's primary target is mothers-to-be and new mothers; the competitor review showed general pain pages alone do not differentiate.
**Safety:** every maternal page carries red-flag guidance and defers to the patient's doctor or midwife; copy requires clinical review before launch.

### ADR-021: Cleaner, shorter UI
**Decision:** reduce visual noise: a 10-section homepage (from 17), no numbered section eyebrows, no decorative arcs on inner-page heroes, smaller section padding, one clear call to action per block.
**Follow-up (same day):** at the clinic's request, text was enlarged (17px root) and the *other* services were given a highlighted, image-led homepage section plus an "Also:" row in the hero, so the maternal focus does not hide general physiotherapy and consultancy.
**Why:** the earlier content expansion made the homepage long; the maternal audience benefits from a calm, uncluttered, reassuring layout. Detailed content stays one click away on its own pages.
