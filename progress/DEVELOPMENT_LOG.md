# Development Log

## 2026-11-23 (later): Maternal-first repositioning and cleaner UI
- **Positioning:** primary audience is women before, during and after pregnancy (ADR-020).
- **Services:** added `preconception-care`, `postnatal-recovery`, `pelvic-floor-therapy`; re-framed `pregnancy-rehabilitation` as *Pregnancy Physiotherapy*. All female-only with required same-gender matching; sample prices and two package prices added; the two women's-health physiotherapists linked.
- **Content:** 5 maternal conditions and 4 maternal articles placed ahead of the general content; maternal stages, FAQ, first-visit steps and red-flag list in `content/maternal.ts`.
- **New page:** `/maternal-care` hub with FAQPage JSON-LD.
- **Homepage:** rewritten (10 sections instead of 17): maternal hero, three stage cards, why Femur, more care, team, booking steps, stories, blog, FAQ + location, CTA. Removed three of my earlier home sections (`find-pain`, `root-cause`, `treatments-strip`).
- **Cleaner UI (ADR-021):** reduced section padding, removed numbered eyebrows and decorative arcs, simplified hero.
- **Nav:** *Maternal Care* is first; *Treatments* moved to the mobile menu/footer; testimonials, FAQ, tagline, announcement, SEO and metadata rewritten for maternal focus.
- **Photography:** 6 new Unsplash photos (couple with newborn, mother and child, sleeping newborn, baby feet, beach yoga, mother with toddler and baby), each viewed on a contact sheet and URL-checked.
- **Tests:** +4 unit tests (maternal services are female-only for patients and practitioners). Total 50.

- **Follow-up polish:** root font 17px, larger headings/buttons; new homepage section *Complete care for every body* (6 other physiotherapy services), *Visiting specialists* block restored, and an "Also:" row of other services in the hero.

### Verified
- `typecheck`, `lint`, `npm test` (50/50), `npm run build` pass; all maternal routes return 200; viewport sweep results are in the section below.

## 2026-11-23: Competitor review and content expansion
- Reviewed a competing Dhaka pain-management clinic for *topics and page types only* (no copy, images, names or numbers reused).
- Added `content/` (typed TS): 10 conditions, 7 treatments, 6 articles. New routes: `/conditions[/slug]`, `/treatments[/slug]`, `/blog[/slug]`, `/home-physiotherapy` (all static, 61 pages total).
- Homepage: *Where does it hurt?*, *Relief that lasts starts with the cause*, treatments strip, latest articles; hero chips now link to condition pages and carry a Bangla line.
- Floating WhatsApp + call button on every public page (`components/layout/quick-contact.tsx`).
- Bilingual: `<Bn>` component, Noto Sans Bengali (`--font-bn`, Tailwind `font-bn`), Bangla secondary lines; English remains primary.
- Navigation: Conditions and Treatments added to the header; Become a Member kept top-level (ADR-015); Blog and Home physiotherapy added to the footer and mobile menu. Desktop nav now starts at 1280px (`xl`).
- Photography: 4 new verified Unsplash photos (`acupuncture`, `bodyCare`, `calm`, `scanReview`); every image URL checked for HTTP 200.

### Problems found & fixed
1. **Header overflow at 1280px** (43px) after the 8th nav link was added, caught by a viewport-emulation sweep (headless Edge over the DevTools protocol). Fixed by showing the header *Ask Nira* button only from 1536px.
2. **Nav decision regression:** first draft removed *Become a Member* from the header, contradicting ADR-015. Restored; Blog moved to footer/mobile/home instead.
3. **Embedding test blocked** by the app's own `X-Frame-Options: DENY` (good security default); switched to CDP emulation instead of iframes.

### Verified
- `typecheck`, `lint`, `npm test` (46/46), `npm run build` (61 pages) pass.
- Link crawl: 57 internal URLs, 0 broken. Images: 26/26 load. Viewport sweep: no horizontal overflow, no unloaded images, 0 console errors.

## 2026-11-12 (UI update & Nira mascot)
- Light, airy homepage hero (bright rehab-clinic photo, soft cream wash, dark text).
- Physiotherapy now shows a therapist guiding an exercise; Pain Management shows a highlighted red pain area; Contact and Services heroes use physiotherapy photos instead of gym shots.
- Nira renamed **AI Consultant** across the site; mascot added (`components/media/nira-mascot.tsx`) on the home Nira card, the membership page and the `/nira` gateway. Original art kept in `docs/brand/`.

## 2026-11-12 (later) — Go-live polish & domain readiness
- Removed all visible demo/placeholder labels; content now reads as a finished site (stand-in data kept in fixtures).
- Hero redesigned: full-bleed exercise photo, centred "Live Better.", no eyebrow box. Dismissible announcement bar. Official logo used for favicon and header.
- Navigation: removed Why Femur (now a section on About), added **Become a Member**. Nira reworded as a members-only consultant and routed through a `/nira` gateway (login → membership check → open).
- Photography: specialist portraits, exercise-based service images, photo page heroes, photo CTA band, photo panels, consultancy card images.
- Domain readiness: `robots.ts`, `sitemap.ts`, social-share image, canonical URL, JSON-LD, `www`→apex redirect, DNS steps in DEPLOYMENT.md.

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
