# Development Log

## 2026-11-12 — Architecture + complete frontend (mock data)

### Implemented
- **Architecture documentation:** the master architecture doc plus database, API, booking engine, membership/commission, frontend and deployment docs.
- **Frontend scaffold:** `create-next-app@15` restructured into `app/ components/ features/ services/ lib/ types/ config/ hooks/` with route groups `(public) (booking) (auth) (patient) (admin)`.
- **Data-access layer:** the `FemurApi` contract (`services/contracts.ts`) has two adapters:
  - a **live** adapter (REST v1, ISR tags for CMS, CSRF header, idempotency key);
  - a **mock** adapter (deterministic seeded demo data, plus a simplified scheduling engine mirroring BOOKING_ENGINE.md).
- **Public site, booking wizard, patient portal and admin portal** (see PROJECT_STATUS).
- **Tests:** Vitest suite covering business-critical pure logic.

### Notable problems & fixes
1. **Node 18 compatibility.** The machine runs macOS 12 with Node 18.20.
   - Next 16 needs Node ≥ 20.9, so we pinned Next 15.5.
   - Tailwind v4.3.5 failed twice: `@tailwindcss/node` requires the ESM-only `magic-string@1`, and the native `@tailwindcss/oxide-*` binaries declare `engines: node >= 20`, so npm skips them.
   - We switched to **Tailwind 3.4.17** (pure JS) and ported the tokens to `tailwind.config.ts` (ADR-008).
   - Vitest is pinned to 3.1.x with Vite 6, the last versions compatible with Node 18.
2. **Hydration mismatch.** `Intl.DateTimeFormat` output differs between Node's ICU and Chrome ("Thursday 12 November 2026" vs "Thursday, 12 November 2026"). All date, time and money formatting is now deterministic, built from Asia/Dhaka parts (ADR-009). Tests lock in the formats.
3. **Layering.** `SignOutButton` moved from `components/` to `features/auth/` so that `components/` never imports `services/`.

### Verified
- `npm run build` succeeds (31 routes). Public pages are static with 5-min ISR and 107–113 kB first-load JS.
- `npm run lint`, `npm run typecheck` and `npm test` (46/46) pass.
- Headless Chrome walkthroughs:
  - homepage renders;
  - mobile booking completes end to end (a female patient is auto-assigned a female physiotherapist, a reference is generated, notification status shows "Not connected yet");
  - admin login → dashboard → calendar (day/week, drawer) → all admin pages render with no console errors.
