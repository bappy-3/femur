# Femur Physiotherapy & Wellness Center — Digital Platform

The platform for **Femur Physiotherapy & Wellness Center** (Uttara, Dhaka). It covers the public website, online appointment booking, the patient portal, the admin and operations portal, memberships, practitioner commissions, and the link to **Nira**, the AI wellness assistant at `nira.femurphysio.com`.

> **Current state (2026-11-12):** the architecture is documented and the **frontend is built**. It runs on clearly labelled sample data ("mock mode"). The backend (NestJS + PostgreSQL), real payments and notifications, and the Nira app are **not built yet**. See [`progress/PROJECT_STATUS.md`](progress/PROJECT_STATUS.md).

---

## Start here

| If you want to… | Read |
| --- | --- |
| Understand the whole system | [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md) |
| Work on the frontend | [`docs/architecture/FRONTEND.md`](docs/architecture/FRONTEND.md) |
| Build the backend / API | [`docs/api/API_CONTRACTS.md`](docs/api/API_CONTRACTS.md), [`docs/database/DATA_MODEL.md`](docs/database/DATA_MODEL.md) |
| Understand booking & scheduling | [`docs/architecture/BOOKING_ENGINE.md`](docs/architecture/BOOKING_ENGINE.md) |
| Understand memberships & commissions | [`docs/architecture/MEMBERSHIP_AND_COMMISSIONS.md`](docs/architecture/MEMBERSHIP_AND_COMMISSIONS.md) |
| Deploy | [`docs/deployment/DEPLOYMENT.md`](docs/deployment/DEPLOYMENT.md) |
| See why things are the way they are | [`progress/DECISIONS.md`](progress/DECISIONS.md) |

## Repository layout

A single repository with **separate, independently built and deployed apps**. There are no workspaces, Turborepo or Nx.

```text
femur/
├── frontend/   Next.js 15 app — public site, booking, /account, /admin   ✅ built (mock data)
├── backend/    NestJS + Prisma + PostgreSQL                              ⏳ Phase 2+
├── nira/       Next.js app for nira.femurphysio.com                       ⏳ Phase 8
├── docs/       Architecture, database, API, deployment
└── progress/   Status, log, tasks, decisions, known issues
```

## Technology

| Layer | Stack |
| --- | --- |
| Frontend | Next.js 15.5 (App Router), React 19, TypeScript (strict), Tailwind CSS 3.4, Motion (selectively), lucide-react, zod, Vitest |
| Backend (planned) | NestJS 11, Prisma 6, PostgreSQL 16, Redis 7 (BullMQ, locks, rate limits), S3-compatible storage |
| Design | Fraunces (display) + Manrope (UI); palette Sage Teal `#6B9799`, Deep Teal `#415F66`, Soft Green `#83B1A0`, Warm Off-white `#F5F5F2`, Warm Accent `#D6A77A` |

## Prerequisites

- **Node.js 18.18+** (the team develops on macOS 12/13 with Node 18; production uses Node 20 LTS)
- npm 10+

> The stack was chosen to work on Node 18: Next.js 15 rather than 16, and Tailwind 3.4 rather than 4. See ADR-002 and ADR-008.

## Run the frontend

```bash
cd frontend
cp .env.example .env.local      # defaults to NEXT_PUBLIC_API_MODE=mock
npm install
npm run dev                     # http://localhost:3000
```

**Try it:**

- **Public site:** `/`, `/services`, `/specialists`, `/pricing`, `/membership`, `/about`, `/contact`, `/faq`
- **Booking:** `/booking`. This is the 7-step wizard. Availability respects gender policy and practitioner schedules.
- **Patient portal:** go to `/login` and choose **Demo patient**, then open `/account`.
- **Admin portal:** go to `/login` and choose **Demo admin**, then open `/admin` and `/admin/calendar`.

Demo sessions and data exist only in **mock mode**. Data is kept in memory, per browser tab, and resets on reload.

### Commands (inside `frontend/`)

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm test` | Vitest unit tests (scheduling, commissions, booking state, calendar layout, formatting, validation) |

## Environment

See [`frontend/.env.example`](frontend/.env.example). Key variables:

- `NEXT_PUBLIC_API_MODE` is `mock` or `live`.
- `NEXT_PUBLIC_API_URL` is the backend origin.
- `NEXT_PUBLIC_NIRA_URL` is the Nira app URL.
- `DEPLOY_ENV=production` makes the build refuse to run unless the API mode is `live`.

No secret is ever needed by the frontend.

## Database setup / backend

This hasn't been built yet. The schema design is in [`docs/database/DATA_MODEL.md`](docs/database/DATA_MODEL.md). It will be implemented with Prisma migrations, plus a raw-SQL exclusion constraint that prevents double booking.

## Deployment overview

`frontend` deploys to Vercel or Docker (standalone). `backend` will deploy to Docker on a VPS with managed PostgreSQL and Redis. `nira` deploys separately. Details are in [`docs/deployment/DEPLOYMENT.md`](docs/deployment/DEPLOYMENT.md).

## Important honesty notes

- All prices, practitioner names and credentials, testimonials and contact details in mock mode are **samples or placeholders**, and they are marked as such in the UI. Real values are entered by admins once the backend exists.
- Payments (bKash, Nagad, gateway), SMS, email and WhatsApp are **not connected**. The UI reports "Not configured" and never fakes success.
- Stock photography (Unsplash) stands in until Femur supplies its own photos.
