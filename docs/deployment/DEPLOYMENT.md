# Deployment Architecture

> Status: plan. Only `frontend/` is buildable today.

## Topology

| Component | Recommended host | Notes |
| --- | --- | --- |
| `frontend/` (femurphysio.com) | Vercel, **or** Docker (`next build` → `output: 'standalone'`) behind Nginx/Caddy | ISR + image optimisation work in both |
| `nira/` (nira.femurphysio.com) | Same as frontend, deployed separately | |
| `backend/` (api.femurphysio.com) | Docker on a VPS (e.g. a DigitalOcean/AWS Singapore region for latency to Dhaka) | Node 20 LTS image |
| PostgreSQL 16 | Managed (RDS / DO Managed PG) | PITR enabled, daily snapshots retained for 14 days |
| Redis 7 | Managed or a container with AOF | Locks, cache, queues |
| Object storage | S3-compatible (S3 / DO Spaces / Cloudflare R2) | Public bucket for CMS media and a private bucket for patient documents |

## Environments

`development` (local, mock or local API) → `staging` (staging.femurphysio.com, real API, test providers) → `production`.

## DNS / TLS

- `femurphysio.com`, `www` → frontend. `www` redirects to the apex.
- `nira.` → nira app. `api.` → backend.
- TLS everywhere (Let's Encrypt via Caddy, or platform-managed). HSTS with preload after verification.
- The session cookie domain is `.femurphysio.com` so it is shared by the main site and Nira.

## Frontend environment variables

See `frontend/.env.example`. Everything with the `NEXT_PUBLIC_` prefix is public, so never put secrets there.

## Build & release (frontend)

```bash
cd frontend
npm ci
npm run lint && npm run typecheck && npm test
NEXT_PUBLIC_API_MODE=live NEXT_PUBLIC_API_URL=https://api.femurphysio.com npm run build
npm start   # or deploy .next/standalone
```

## Monitoring (planned)

Error tracking (Sentry or a self-hosted equivalent), uptime checks on `/` and `api/v1/health`, structured logs shipped to a log store, and a Postgres slow-query log.

## Deploying the frontend on Vercel

1. Import the GitHub repo in Vercel.
2. Set **Root Directory** to `frontend` (the repo holds several apps).
3. Framework preset: Next.js (detected). Install and build commands come from `frontend/vercel.json`.
4. Environment variables (Project → Settings → Environment Variables):

| Variable | Preview / demo | Production (with backend) |
| --- | --- | --- |
| `NEXT_PUBLIC_API_MODE` | `mock` | `live` |
| `NEXT_PUBLIC_API_URL` | – | `https://api.femurphysio.com` |
| `NEXT_PUBLIC_SITE_URL` | the Vercel URL | `https://femurphysio.com` |
| `NEXT_PUBLIC_NIRA_URL` | `https://nira.femurphysio.com` | same |
| `DEPLOY_ENV` | unset | `production` (blocks mock builds) |

A mock-mode deployment is a **design preview only**: sample data, demo logins, nothing persists. Do not point the real domain at it.
5. Domains: add `femurphysio.com` and `www` to this project; `nira.` and `api.` go to their own projects/hosts.

## Connecting the domain (femurphysio.com)

The site is domain-ready: canonical URL, `robots.txt`, `sitemap.xml`, social-share image and structured data are all generated from `NEXT_PUBLIC_SITE_URL`, and the `www` ↔ apex redirect is configured in Vercel (Settings → Domains), not in app code, to avoid redirect loops.

1. In Vercel: Project → **Settings → Domains** → add `femurphysio.com` and `www.femurphysio.com`.
2. At your DNS provider, add the records Vercel shows. Typically:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |
| CNAME | `nira` | the Nira project's Vercel target (when that app exists) |
| CNAME / A | `api` | the backend host (when it exists) |

   Always prefer the exact values Vercel displays for your project.
3. Set `NEXT_PUBLIC_SITE_URL=https://femurphysio.com` in Vercel and redeploy.
4. Wait for DNS and the automatic HTTPS certificate (minutes to a few hours).
5. Submit `https://femurphysio.com/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
6. Check a share preview (WhatsApp/Facebook) and `https://femurphysio.com/robots.txt`.

Until the backend exists the site runs on built-in data. Do not point real patients at it yet.

### If the domain doesn't show the site (troubleshooting)

1. **Vercel → Project → Settings → Domains.** Each domain must show **Valid Configuration**. If it says *Invalid Configuration*, Vercel tells you the exact DNS records needed.
2. **Pick ONE DNS home.** Either keep Hostinger's nameservers and add Vercel's records there (A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`), **or** switch the domain to Vercel's nameservers (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`) and manage records in Vercel. Mixing both, or leaving old Hostinger A/AAAA/parking records next to the Vercel ones, breaks it. Delete any other `A`, `AAAA` or `CNAME` records for `@` and `www`.
3. **Only one redirect.** In Vercel Domains, set one of `www` / apex as primary and let the other redirect to it. Do not add a second redirect in code or in Hostinger (the app has none). Disable Hostinger's "force HTTPS"/domain-forwarding while Vercel manages the domain.
4. **Domain is on the right project and the latest Production deployment is "Ready"** (project Root Directory = `frontend`).
5. DNS can take minutes to hours. Check with `dig femurphysio.com +short` (expect `76.76.21.21`) and `dig www.femurphysio.com +short`.
