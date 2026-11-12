# Credentials & Login URLs

> **Demo logins only.** There is no backend yet, so there are no real accounts. These logins work only in **mock mode** (`NEXT_PUBLIC_API_MODE=mock`) and give access to sample data that is kept in the browser tab and resets on reload. They do **not** exist in live mode.
>
> **Do not store real passwords in this file or anywhere in the repo.** Once the backend exists, real staff accounts are created by the Super Admin and secrets live in environment variables / a password manager.

## URLs

Replace the host with your deployed domain (the Vercel URL now, `https://femurphysio.com` once connected).

| Area | Path | Local URL |
| --- | --- | --- |
| Login (everyone) | `/login` | http://localhost:3000/login |
| Register (free patient account) | `/register` | http://localhost:3000/register |
| Patient portal | `/account` | http://localhost:3000/account |
| Admin portal | `/admin` | http://localhost:3000/admin |
| Admin calendar | `/admin/calendar` | http://localhost:3000/admin/calendar |
| Nira gateway (members only) | `/nira` | http://localhost:3000/nira |

Staff and patients use the same login page. After login, staff go to `/admin` and patients to `/account`.

## Demo accounts (mock mode)

| Role | Identifier (type in the login box) | Password | Lands on |
| --- | --- | --- | --- |
| Patient (free user) | `demo.patient` (anything without the word "admin") | any password of 6+ characters, e.g. `demo-password` | `/account` |
| Admin (full staff access) | `demo.admin` (any identifier containing "admin") | any password of 6+ characters, e.g. `demo-password` | `/admin` |

How the demo rule works: the identifier must be at least 3 characters and the password at least 6. If the identifier contains `admin`, you are signed in as the demo **Admin**; otherwise as the demo **Patient**.

**One-click buttons:** set `NEXT_PUBLIC_SHOW_DEMO_LOGIN=true` (in `frontend/.env.local` or Vercel environment variables) and `/login` shows **Demo patient** and **Demo admin** buttons. They are hidden by default.

## Other roles

| Role | Demo account? | Notes |
| --- | --- | --- |
| Receptionist | No | Defined in the architecture, no demo login yet. Staff access in mock mode is the Admin account. |
| Practitioner | No | Same: no separate portal view yet. |
| Super Admin | No | Created from environment variables by the backend seed (Phase 2). |
| Active member (Nira access) | Via the demo patient | Log in as the demo patient → `/account/membership` → request a plan → log in as demo admin → `/admin/pricing` → **Activate** the member → the patient can open Nira. |

## Real accounts (after the backend is built)

- The first **Super Admin** is created from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in the backend environment (not committed).
- Other staff are added by the Super Admin; passwords are hashed with argon2id and never visible.
- Patients self-register at `/register`.
- Third-party credentials (bKash, Nagad, SMS, email, WhatsApp, LLM provider) are server-side environment variables only.
