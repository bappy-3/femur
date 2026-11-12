# Frontend Architecture & Conventions (`frontend/`)

> Read this before adding a page, component or API call.

## 1. Folder responsibilities

```text
frontend/
├── app/                    Routes only: page.tsx, layout.tsx, loading.tsx, metadata, route handlers.
│   ├── (public)/           Marketing site (SiteHeader/SiteFooter)
│   ├── (booking)/booking/  Booking wizard (focused chrome)
│   ├── (auth)/             Login / register / forgot password
│   ├── (patient)/account/  Patient portal
│   └── (admin)/admin/      Admin portal
├── components/             Reusable, presentational, domain-agnostic
│   ├── ui/                 Button, Card, Badge, Field, Input, Select, Dialog, Drawer, Tabs, Skeleton, EmptyState …
│   ├── layout/             Container, Section, SiteHeader, SiteFooter, PortalShell, AdminShell
│   ├── navigation/         MainNav, MobileNav, SideNav, Breadcrumbs
│   ├── sections/           Marketing building blocks (PageHero, CtaBand, SectionHeading, FeatureGrid …)
│   └── media/              Placeholder images, brand marks, decorative motifs
├── features/               Domain features: UI + hooks + local state + schemas for ONE domain
│   ├── home/               Homepage sections (compose components/sections)
│   ├── service-catalog/    Service cards, detail blocks, icons
│   ├── practitioners/      Practitioner cards, availability summaries
│   ├── pricing/            Price tables, membership plan cards
│   ├── booking/            Booking wizard (reducer, steps, hooks)
│   ├── auth/               Auth forms, server actions, schemas
│   ├── account/            Patient portal widgets
│   ├── admin-calendar/     Resource calendar (day/week), drag & drop, layout math
│   └── admin/              Admin modules: dashboard, appointments, patients, practitioners, services, pricing, cms, finance
├── services/               Data access. The ONLY layer allowed to do network I/O.
│   ├── http/               fetch wrapper, ApiError, envelope unwrapping
│   ├── api/                Live adapters (one file per domain) → backend /api/v1
│   ├── mock/               Sample fixtures + in-memory adapters (dev/demo only)
│   ├── contracts.ts        Adapter interfaces (FemurApi)
│   └── index.ts            `api` singleton: picks live or mock by env
├── hooks/                  Generic React hooks (useDisclosure, useMediaQuery …)
├── lib/                    Pure utilities (datetime in Asia/Dhaka, money, cn, strings). Unit-tested.
├── types/                  API contract types (mirror docs/api/API_CONTRACTS.md)
├── config/                 site.ts (nav, routes, external URLs), env.ts (validated env)
├── styles/                 (reserved) extra global CSS; tokens live in app/globals.css
└── middleware.ts           Cookie-presence gate for /account and /admin
```

### Import rules

| From → may import | components | features | services | lib/types/config |
| --- | --- | --- | --- | --- |
| `app/` | ✅ | ✅ | ✅ (server components) | ✅ |
| `features/` | ✅ | own feature + `features/*/index` public exports | ✅ | ✅ |
| `components/` | ✅ | ❌ | ❌ | ✅ |
| `services/` | ❌ | ❌ | ✅ | ✅ |
| `lib/` | ❌ | ❌ | ❌ | `types` only |

## 2. Server vs client components

- Default to **Server Components**. Add `"use client"` only to the smallest interactive leaf (e.g. `MobileNav`, `BookingWizard`, `AdminCalendar`, forms).
- Pass plain data from server to client. Never pass functions or classes.
- Client components fetch through `api.*` too. In live mode this goes to the backend with `credentials: 'include'`.

## 3. Naming

- Files: `kebab-case.tsx`. Components: `PascalCase`. Hooks: `use-thing.ts` exporting `useThing`.
- One component per file unless the others are tiny private helpers.
- Keep files short. Split anything over ~250 lines.
- Types: `type` for unions and data shapes, `interface` for adapter contracts.

## 4. Design system

Tokens (see `tailwind.config.ts`; shared CSS variables such as radii and shadows live in `app/globals.css`):

| Token | Value | Use |
| --- | --- | --- |
| `--color-sage` | `#6B9799` | Primary brand, links, focus rings |
| `--color-teal` | `#415F66` | Primary buttons, headings on light backgrounds |
| `--color-mint` | `#83B1A0` | Supporting accents, success-ish states |
| `--color-cream` | `#F5F5F2` | Page background |
| `--color-ink` | `#25383B` | Body text |
| `--color-mist` | `#EDF3F0` | Section background, cards |
| `--color-sand` | `#D6A77A` | **Sparingly**: key CTAs, highlights |

Formatting rule: never use `Intl`/`toLocale*` in anything rendered on the server. Use `lib/datetime.ts` and `lib/money.ts`, which are deterministic and always in Asia/Dhaka.

Typography: **Fraunces** (display, headings, numerals) + **Manrope** (UI, body).
Radius: 10–16 px for cards and full for pills. Avoid oversized blobs. Borders are 1 px `ink/10`. Shadows are soft and used only on elevated elements.
Motion respects `prefers-reduced-motion` and lasts ≤ 400 ms.

## 5. Data access pattern

```ts
// Server Component
import { api } from '@/services';
const services = await api.catalog.listServices({ kind: 'PHYSIOTHERAPY' });
```

Add a new endpoint in this order:

1. Add the types to `types/`.
2. Add the method to the interface in `services/contracts.ts`.
3. Implement it in `services/api/<domain>.ts` (live) **and** `services/mock/<domain>.ts`.
4. Use it from features.

## 6. Mock mode rules

- `NEXT_PUBLIC_API_MODE=mock` is for local development and design review only.
- Fixtures **never** contain real Femur prices, names, credentials or contact details. Values are marked `SAMPLE` or `placeholder`.
- `<DemoNotice />` renders whenever mock mode is active.
- Mutations in mock mode change in-memory state only. They are lost on reload, and the UI says so.
