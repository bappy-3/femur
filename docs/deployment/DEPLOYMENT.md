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
