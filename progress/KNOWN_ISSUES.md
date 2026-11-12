# Known Issues, Limitations & Technical Debt

## Not implemented / not connected (by design at this stage)
- **No backend.** Everything runs in mock mode. Nothing persists, and data resets on reload. Mock state is **per runtime**, which has two effects:
  - bookings and admin edits made in the browser are visible in the same tab's portals but **not** on server-rendered public pages;
  - CMS edits don't change the public site in mock mode.
- **Authentication is simulated** in mock mode. A readable, non-httpOnly demo cookie stands in for the real session. It must never ship to production (the build is guarded by `DEPLOY_ENV=production`).
- **Payments:** bKash, Nagad and the card gateway are not integrated. "Pay at clinic" and "manual transfer" create *pending* records only.
- **Notifications:** SMS, email and WhatsApp are not connected. Confirmation screens show "Not connected yet". The contact form and password reset show honest "not connected" messages.
- **Nira:** links to `nira.femurphysio.com` only. The app itself is Phase 8.
- **Media uploads** for the CMS and practitioner photos are pending the backend media service.
- **Clinical notes** (restricted, audited) are designed but have no UI yet. Only operational internal notes exist.
- **Availability exceptions** (leave, holidays) are designed but have no admin UI yet. Use "Block time" for now.

## Placeholder content (needs Femur's real information)
- Address, phone, WhatsApp, email and opening hours. These are marked with "Placeholder" badges.
- Practitioner names, photos, qualifications and experience.
- All prices and membership fees (labelled "Demo data").
- Testimonials (labelled "Sample"), and the Our Story text.
- Photography is Unsplash stock as a stand-in.

## Technical debt / follow-ups
- The mock adapter and fixtures are bundled even in `live` mode, unless tree-shaking removes them. Consider a dynamic import, or excluding `services/mock` via webpack alias, before production.
- The booking page's first-load JS is about 229 kB (Motion + mock engine in mock mode). Re-measure in live mode, and consider dropping Motion from the wizard if CWV suffers.
- Lighthouse / Core Web Vitals haven't been measured yet (the target is ≥ 90 mobile).
- Drag-and-drop in the calendar uses HTML5 DnD, which works with a mouse but not on touch devices. Touch users can reschedule from the drawer instead.
- There are no E2E tests yet. Unit tests cover pure logic only.
- Frontend API types are hand-maintained until OpenAPI generation is available (ADR-006).
- `npm audit` reports advisories in transitive dev dependencies from the scaffold. Review them before production.
