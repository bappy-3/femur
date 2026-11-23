# Known Issues, Limitations & Technical Debt

## Not implemented / not connected (by design at this stage)
- **No backend.** Everything runs in mock mode. Nothing persists, and data resets on reload. Mock state is **per runtime**, which has two effects:
  - bookings and admin edits made in the browser are visible in the same tab's portals but **not** on server-rendered public pages;
  - CMS edits don't change the public site in mock mode.
- **Authentication is simulated** in mock mode. A readable, non-httpOnly demo cookie stands in for the real session. It must never ship to production (the build is guarded by `DEPLOY_ENV=production`).
- **Payments:** bKash, Nagad and the card gateway are not integrated. "Pay at clinic" and "manual transfer" create *pending* records only.
- **Notifications:** SMS, email and WhatsApp are not connected. Confirmation screens tell the patient to keep their reference; the contact form and password reset fall back to "contact the clinic" wording.
- **Nira:** the `/nira` gateway (login → membership check) exists; the Nira app itself is Phase 8.
- **Media uploads** for the CMS and practitioner photos are pending the backend media service.
- **Clinical notes** (restricted, audited) are designed but have no UI yet. Only operational internal notes exist.
- **Availability exceptions** (leave, holidays) are designed but have no admin UI yet. Use "Block time" for now.

## MUST CHANGE BEFORE REAL LAUNCH
- **Specialist photos, names and qualifications are stand-ins.** The portraits are stock photos of strangers and the names/credentials are invented. Presenting them as Femur's real staff misleads patients. Replace all of it with real, consented staff details in `frontend/services/mock/fixtures/practitioners.ts` (or the admin portal once the backend exists).
- **Prices, testimonials, phone/WhatsApp/address/email, and the clinic story** are stand-ins and must be replaced with real, approved content.
- **The site runs on built-in data**, so bookings, the contact form and logins don't reach the clinic. Don't direct real patients to it until the backend is connected.

## Content expansion (2026-11-23): review before launch
- **All new medical copy is a draft written by Claude** (conditions, treatments, articles, Bangla text). A licensed Femur clinician must review it. See the checklist in [`docs/content/CONTENT_GUIDE.md`](../docs/content/CONTENT_GUIDE.md) §5.
- **Maternal copy needs obstetric and women's-health review** (pregnancy exercise advice, postnatal timing such as "around six weeks", C-section guidance, red-flag lists, FAQ). It is general information and must not be published as clinical advice without sign-off.
- **Maternal service prices are sample values** (like all prices) and must be set by Femur.
- **Only two female physiotherapists** are linked to the maternal services in the sample data; real staffing and availability must be configured.
- **Testimonials are stand-in text** written for the maternal focus (`cms.ts`); replace with real, consented patient stories. Do not publish invented testimonials as genuine.
- **Stock photography of strangers** (newborns, families, pregnancy) is placeholder until Femur supplies its own photos with consent.
- **Treatments Femur may not offer:** shockwave, PEMF, cryotherapy, rTMS and ozone are tagged *Confirmed at booking*. rTMS and ozone require qualified medical clinicians. Remove any that Femur does not provide.
- **Home physiotherapy** is a request page only. Coverage areas and fees are not defined, and in mock mode the form falls back to *call or WhatsApp*. Delete the page if the service is not offered.
- **Bangla is partial** (secondary lines only). Full translation needs locale routing. Bangla wording needs a native-speaker review.
- **WhatsApp button** uses the stand-in number from `cms.ts`; it will message a wrong number until replaced.
- **Blog author** is shown as *Femur clinical team* with no named reviewer; add one when real reviewers exist.
- **Content is not editable in the admin CMS yet** (static TypeScript modules, ADR-017).
- **Desktop nav starts at 1280px.** Between 1024 and 1279px the hamburger menu is used.

## Other stand-ins
- Photography is Unsplash stock (page chrome, services, staff portraits) until Femur supplies its own.
- Demo login buttons are hidden unless `NEXT_PUBLIC_SHOW_DEMO_LOGIN=true`.

## Technical debt / follow-ups
- The mock adapter and fixtures are bundled even in `live` mode, unless tree-shaking removes them. Consider a dynamic import, or excluding `services/mock` via webpack alias, before production.
- The booking page's first-load JS is about 229 kB (Motion + mock engine in mock mode). Re-measure in live mode, and consider dropping Motion from the wizard if CWV suffers.
- Lighthouse / Core Web Vitals haven't been measured yet (the target is ≥ 90 mobile).
- Drag-and-drop in the calendar uses HTML5 DnD, which works with a mouse but not on touch devices. Touch users can reschedule from the drawer instead.
- There are no E2E tests yet. Unit tests cover pure logic only.
- Frontend API types are hand-maintained until OpenAPI generation is available (ADR-006).
- `npm audit` reports advisories in transitive dev dependencies from the scaffold. Review them before production.
