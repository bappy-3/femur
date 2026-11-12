# Project Status

**Last updated:** 2026-11-12
**Current stage:** Phase 1 complete · Phase 3–6 **frontend** complete against mock data · Backend not started

## Completed

### Phase 1 — Architecture & planning ✅
- [x] System architecture (`docs/architecture/ARCHITECTURE.md`)
- [x] Frontend conventions (`docs/architecture/FRONTEND.md`)
- [x] Booking & scheduling engine design (`docs/architecture/BOOKING_ENGINE.md`)
- [x] Membership, payments & commission design (`docs/architecture/MEMBERSHIP_AND_COMMISSIONS.md`)
- [x] Database design (`docs/database/DATA_MODEL.md`)
- [x] REST API v1 contracts (`docs/api/API_CONTRACTS.md`)
- [x] Deployment plan (`docs/deployment/DEPLOYMENT.md`)

### Frontend (`frontend/`)
These items work end to end **on mock data**. Real persistence needs the backend.

- [x] Foundation: Next.js 15 / React 19 / TS strict / Tailwind 3.4, design tokens, fonts, folder architecture, data-access adapter layer (live + mock), middleware gate, security headers
- [x] Design system: buttons, cards, badges, forms, alerts, skeletons, empty states, dialog/drawer, toasts, status badges, placeholder & demo markers, logo
- [x] Public website: Home (13 sections), Services, Service detail ×13, Specialists, Pricing, Membership, About, Our Story, Why Femur, FAQ (with JSON-LD), Contact (form + map), 404
- [x] Booking wizard: 7 steps, gender-policy aware, real-time availability via API contract, slot-taken recovery, idempotency key, confirmation with reference + .ics download, honest notification status
- [x] Auth UI: login, register, forgot password (zod validation, BD phone normalisation), demo sessions in mock mode
- [x] Patient portal: overview, appointments (cancel/reschedule within policy), membership (status distinctions + purchase request), family profiles, payments, profile
- [x] Admin portal:
  - dashboard (stats, revenue chart, workload);
  - **resource calendar** (day/week, filters, click-to-create, drag-and-drop reschedule with conflict preview, block time, detail drawer, treating practitioner);
  - appointments list with CSV export;
  - patients (search, walk-in, profile, notes);
  - practitioners (profile, services, schedule rules, commission rules);
  - services (booking rules);
  - pricing, plans and members;
  - CMS (contact/hours, homepage, announcement, FAQs, testimonials, SEO);
  - finance (revenue, payment verification, commissions with override/settle/export, integrations status)
- [x] Unit tests: 46 passing (scheduling, commissions, booking state, calendar layout, date/money, validation, CSV)
- [x] `npm run build`, `lint` and `typecheck` all pass

## In progress
- Nothing is actively in progress. The frontend milestone is complete and awaiting review.

## Pending
- Phase 2: backend scaffold (NestJS, Prisma, PostgreSQL, Redis), auth, error and logging foundation
- Phase 5 (server side): scheduling engine, exclusion constraint, holds, lifecycle
- Phase 7: membership, payments and commission services
- Phase 8: Nira app (`nira/`)
- Phase 9: concurrency tests, Lighthouse/CWV measurement, accessibility audit, e2e tests
- Phase 10: production configuration, CI/CD, monitoring, backups
- Answers to the open business questions Q1–Q7 (ARCHITECTURE.md §15)
