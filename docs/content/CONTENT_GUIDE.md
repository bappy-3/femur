# Content Library Guide: Conditions, Treatments, Blog, Home Visits

**Added:** 2026-11-23 · **Updated:** 2026-11-23 (maternal-first repositioning) · **Scope:** public-site content (frontend only)

This guide explains the content that was added after a competitor review, where it lives, how to customize it, and what **must** be reviewed by a clinician before launch.

---

## 0. Primary focus: maternal care (pre-pregnancy, pregnancy, postnatal)

Femur's **primary audience is women before, during and after pregnancy**. The site is organised around three stages:

| Stage | Bookable service (slug) | Related condition pages |
|---|---|---|
| Pre-pregnancy | `preconception-care` | Preparing for Pregnancy |
| Pregnancy | `pregnancy-rehabilitation` (shown as *Pregnancy Physiotherapy*) | Back Pain in Pregnancy; Pelvic Girdle & Hip Pain |
| Postnatal | `postnatal-recovery` | C-section Recovery; Core Recovery & Separated Abdominal Muscles; Pelvic Floor & Postpartum Recovery |
| Cross-stage | `pelvic-floor-therapy` | Pelvic Floor & Postpartum Recovery |

What this changed:
- **Four bookable services** were added or re-framed in `services/mock/fixtures/catalog.ts` (they sort first). All are `eligibleGenders: ["FEMALE"]` with the *required same-gender* policy, so **only women can book them and only female physiotherapists are offered**. This is covered by unit tests.
- **Prices** (sample values) were added in `pricing.ts`; the two women's-health physiotherapists were linked to the services in `practitioners.ts`.
- **New hub page** `/maternal-care` (`app/(public)/maternal-care/page.tsx`, data in `content/maternal.ts`): the three stages, promises, first-visit steps, FAQ (with FAQPage JSON-LD) and a "call your doctor or midwife first" warning box.
- **Homepage** was shortened and re-centred on maternal care (see §6.1).
- **Content order:** `conditions-maternal.ts` and `articles-maternal.ts` are merged *in front of* the general content, so maternal items lead every list.
- **Treatments:** device-based treatments are not routinely suitable in pregnancy. Treatment pages already carry "tell us first if you are pregnant", and `/treatments` states that pregnancy care focuses on hands-on care and exercise.

> **Safety:** all maternal copy is a draft and **must be reviewed by a women's-health physiotherapist and an obstetric clinician** before launch (see §5). Red-flag lists on every maternal page tell women when to contact a doctor or midwife first.

---

## 1. Why this was added

A review of a competing Dhaka pain-management clinic showed that patients are served by three kinds of pages that Femur did not yet have:

| Gap found | What patients look for | What we built |
|---|---|---|
| Pain-area pages | "knee pain", "back pain", "migraine" | **Conditions** (`/conditions`, `/conditions/[slug]`) |
| Technology / therapy pages | "shockwave therapy", "acupuncture", "PEMF" | **Treatments** (`/treatments`, `/treatments/[slug]`) |
| Educational articles | long-tail searches, trust-building | **Health blog** (`/blog`, `/blog/[slug]`) |
| Home service | "physiotherapy at home Dhaka" | **Home physiotherapy** (`/home-physiotherapy`) |
| Fast contact | WhatsApp-first behaviour in Bangladesh | **Floating WhatsApp / call button** on all public pages |
| Symptom-first entry on the homepage | visitors who don't know the service name | New home sections: *Where does it hurt?*, *Relief that lasts starts with the cause*, *Treatments & technology*, *Health blog* |

### How the research was used (and not used)

- The competitor site was used **only to learn which topics and page types matter**: the list of conditions, the treatment families, the page structure and the contact patterns.
- **No text, images, logos, doctor names, prices, phone numbers or addresses were copied.** All copy was written fresh for Femur.
- The design is deliberately different: image-overlay tiles, a comparison block, arched hero frames, a fixed Femur colour system, and a bilingual secondary line.
- Their unverified claims ("no side effects", "clinically proven", "WHO-recognised", "80% of people…") were **not** reused. Femur's copy uses hedged, honest wording and includes "see a doctor first" red flags on every condition page.
- Known issues noticed on their site (broken placeholder links, mixed-up ozone/weight text) were avoided.

---

## 2. Where everything lives

```
frontend/
├── content/                      ← EDIT HERE to change copy
│   ├── maternal.ts               The 3 stages, promises, first-visit steps, maternal FAQ, warning signs
│   ├── conditions-maternal.ts    5 maternal conditions (shown first)
│   ├── conditions.ts             10 general conditions + merges the maternal ones (typed: Condition)
│   ├── treatments.ts             7 treatments  (typed: Treatment)
│   ├── articles-maternal.ts      4 maternal articles (shown first)
│   └── articles.ts               6 general articles + merges the maternal ones (typed: Article)
├── types/content.ts              Shapes of the three content types
├── features/content/cards.tsx    ConditionCard, TreatmentCard, ArticleCard
├── features/home/
│   ├── hero.tsx                  Maternal-first hero + 3 stage shortcuts
│   ├── maternal-journey.tsx      The three stage cards
│   ├── more-care.tsx             Quiet row of other services
│   └── articles-preview.tsx      Latest articles (maternal first)
├── components/
│   ├── ui/bn.tsx                 <Bn> wrapper for Bangla text
│   └── layout/quick-contact.tsx  Floating WhatsApp + call buttons
└── app/(public)/
    ├── maternal-care/            ← the maternal hub
    ├── conditions/ [slug]/       treatments/ [slug]/     blog/ [slug]/
    └── home-physiotherapy/
```

Other files touched: `config/site.ts` (routes, nav, footer), `app/sitemap.ts` (new URLs), `app/layout.tsx` (Bangla font), `tailwind.config.ts` (`font-bn`), `features/home/hero.tsx` (pain-area chips, Bangla line), `services/mock/fixtures/images.ts` (4 new stock photos).

> **Design note:** these pages are generated from typed TypeScript modules, not from the mock API. They are static (SSG), fast, and need no backend. When the backend CMS exists (Phase 2), the same types can be served from `api.cms`; only the import in each page changes.

---

## 3. How to customize

### Edit an existing item
Open the file in `content/`, change the text, save. The page, the cards, the sitemap and the cross-links update automatically.

### Add a condition
Add an object to `maternalConditions` (`content/conditions-maternal.ts`) for pre-pregnancy, pregnancy or postnatal topics, or to `generalConditions` in `content/conditions.ts` for others.
- `slug` becomes the URL (`/conditions/<slug>`), so use lowercase words with hyphens.
- `serviceSlug` must be a real bookable service (see `services/mock/fixtures/catalog.ts`): `physiotherapy`, `pain-management`, `orthopedic-rehabilitation`, `neurological-rehabilitation`, `sports-injury-rehabilitation`, `post-operative-rehabilitation`, `pregnancy-rehabilitation`, `posture-correction`, `exercise-therapy`.
- `treatmentSlugs` and `relatedArticleSlugs` must match existing slugs. Unknown slugs are silently skipped, so double-check the page.
- Order is: maternal conditions first, then general. The first one is the large tile on `/conditions`.

### Add a treatment
Add an object to `treatments` in `content/treatments.ts`. Set `availability: "core"` if routinely offered, or `"confirm"` to show the "Confirmed at booking" tag.

### Add an article
Add an object to `maternalArticles` (`content/articles-maternal.ts`) or `generalArticles` (`content/articles.ts`). Articles sort by `publishedOn` (newest first; the newest is the featured one). The homepage shows the latest three.

### Change the images
Stock photos are defined in `services/mock/fixtures/images.ts` (`stock.*`). Replace a URL there, or point a content item's `image` to a new entry. Use your own clinic photos when available. All images must be hosted on a domain allowed in `next.config.ts` → `images.remotePatterns` (currently `images.unsplash.com` and `cdn.femurphysio.com`).

### Change contact numbers
The WhatsApp button, home-visit page and footer all read `settings.contact` from `services/mock/fixtures/cms.ts` (admin CMS later). WhatsApp links use the digits of `contact.whatsapp`.

---

## 4. Bilingual approach (English primary, Bangla secondary)

- English is the main language everywhere.
- Bangla appears as a **secondary line** beside names and summaries (`bn`, `bnSummary`, `bnTitle` fields), in a "বাংলায় সংক্ষেপে" box on every condition page, in the hero and in section headings.
- Bangla text is wrapped in `<Bn>` which sets `lang="bn"` (helps screen readers and SEO) and uses the **Noto Sans Bengali** font (loaded via `next/font`, Bengali glyphs only).
- **This is not full translation.** Page bodies, FAQs and articles are English only. A complete Bangla version would need locale routing (`/bn/...`) and a translation workflow. It is listed as a follow-up in `progress/KNOWN_ISSUES.md`.
- All Bangla text was drafted for Femur and **should be read by a native-speaking clinician** before launch.

---

## 5. Needs clinical / business confirmation BEFORE launch

These are **drafts**. Do not publish medical content without sign-off from a licensed Femur clinician.

| Item | What to confirm |
|---|---|
| **All maternal copy** (conditions, stages, FAQ, articles) | Review by a women's-health physiotherapist **and** an obstetric clinician. Confirm timing statements such as "around six weeks" for starting postnatal treatment, the red-flag lists, and what is advised after C-section. |
| **Which treatments Femur actually offers** | Shockwave, PEMF, cryotherapy, rTMS and ozone are set to `availability: "confirm"`. Remove any Femur does not provide, or switch to `"core"`. **rTMS and ozone need a qualified medical clinician; do not list them unless this is true.** |
| Session length, course size, sensations | Written as typical ranges; confirm with your protocols. |
| "Tell us first / see a doctor if" lists | Review every contraindication and red-flag list. |
| Article statements | Have a physiotherapist review each of the 6 articles. A named reviewer line can be added to `Article` later. |
| Bangla text | Native-speaker review. |
| Home visits | Confirm Femur offers them, coverage areas and fees. The page says these are "confirmed when you contact us". If not offered, delete `app/(public)/home-physiotherapy/` and its links in `config/site.ts`. |
| Opening hours, phone, WhatsApp, address | Still stand-ins in `cms.ts` (see KNOWN_ISSUES). |
| Photos | Stock photography of strangers; replace with real clinic photos. |

---

## 6. Navigation and layout changes

- **Header:** `Maternal Care · Services · Conditions · Specialists · Pricing · About · Contact · Become a Member` (ADR-015 preserved). The desktop nav appears from **1280px (`xl`)**; below that the hamburger menu is used.
- "Ask Nira" in the header shows from 1536px (`2xl`); it remains in the mobile menu, the CTA bands and the *Ask Nira* page.
- **Mobile menu** additionally lists *Treatments*, *Health blog* and *Home physiotherapy*.
- **Footer** adds *Maternal care*, *Conditions we treat*, *Treatments & technology*, *Home physiotherapy* and *Health blog*.

### 6.1 Homepage structure (kept short on purpose)

1. Hero: maternal headline, two actions, trust points, three stage shortcuts, and an **"Also:"** row linking to the other services
2. Support through every stage (Pre-pregnancy / Pregnancy / Postnatal)
3. **Complete care for every body**: six image-led cards for the other physiotherapy services (`features/home/other-services.tsx`)
4. Why Femur (care designed around women and mothers)
5. **Visiting specialists**: nutrition, general medicine, eye and dental cards
6. Our specialists (female physiotherapists first)
7. How booking works
8. Patient stories
9. Health blog
10. FAQ + location
11. Closing call to action

Which other services appear in section 3 is set by the `SLUGS` list at the top of `other-services.tsx`; the "Also:" chips are the `OTHER` list in `hero.tsx`.

Removed from the homepage to keep it calm (pages still exist): highlights strip, approach, membership teaser, "Where does it hurt?" grid, "Relief that lasts" comparison, treatments strip.

### 6.2 "Cleaner UI" changes

- Section vertical padding reduced (`py-20/24` → `py-16/20`), tighter heading spacing.
- Numbered section eyebrows ("01 — …") removed.
- Decorative arcs removed from inner-page heroes; hero reduced to one message and two buttons; floating chips removed.
- Shorter homepage (17 sections → 11), with the other services given a proper, image-led section.
- **Larger text:** the root font size is 17px (was 16px) in `app/globals.css`, so every rem-based size scales up about 6%. Section headings, intros, page-hero titles and buttons were also stepped up (buttons `md` 44→48px, `lg` 52→56px high).
- Section backgrounds alternate white / cream / mint so two tinted bands never sit side by side.

## 7. Booking

The existing 7-step booking wizard is unchanged and is reused:
- Every condition and treatment page has a **Book an assessment** button that opens `/booking?service=<slug>` with the right service preselected.
- Home visits use a request form (`ContactForm`). In mock mode it shows "please call or WhatsApp" because there is no backend yet, and it never pretends a message was sent.

---

## 8. Quality checks performed (2026-11-23)

| Check | Result |
|---|---|
| `npm run typecheck`, `npm run lint` | Pass |
| `npm test` | 50 / 50 pass (46 existing + 4 for the maternal services' same-gender rules) |
| `npm run build` | Pass (61 static pages) |
| Route smoke test (all new pages, valid + invalid slugs) | 200 / 404 as expected |
| Link crawl over 57 unique internal URLs | 0 broken |
| All stock image URLs | 26 / 26 return 200 |
| Real-device-emulation sweep in headless Edge (viewports from 360 to 1920 px): horizontal overflow, unloaded images, console errors | See result below |

**Bug found and fixed during testing:** at 1280 px the header overflowed by 43 px once the eighth nav link was added. Fix: "Ask Nira" in the header now shows only at ≥1536 px.

---

## 9. How to run locally

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000   (hot reload; best while customizing)
```

Production check: `npm run build && npm start`.
