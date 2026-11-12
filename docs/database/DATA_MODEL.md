# Data Model (PostgreSQL + Prisma) — Design

> Status: **design only**. It will be implemented as `backend/prisma/schema.prisma` in Phase 2/5.
> Conventions: `snake_case` tables/columns (Prisma `@@map`/`@map`), `uuid` v7 primary keys, `created_at`/`updated_at` everywhere, money in **poisha** (`BIGINT`), times as `timestamptz` (UTC), business dates as `date` interpreted in `Asia/Dhaka`.
> Deletes: **soft-delete** (`deleted_at`) for business entities. Hard delete only for join rows and ephemeral data. Historical rows (appointments, payments, commissions, audit) are **never** deleted.

## 1. Identity & access

| Table | Key columns | Notes |
| --- | --- | --- |
| `users` | id, email (citext, unique, nullable), phone (E.164, unique), password_hash (argon2id), status (`ACTIVE`/`LOCKED`/`DISABLED`), phone_verified_at, last_login_at | Phone is the primary identifier in BD; email is optional |
| `roles` | id, key (`PATIENT`,`PRACTITIONER`,`RECEPTIONIST`,`ADMIN`,`SUPER_ADMIN`) | Seeded |
| `permissions` | id, key (`appointments.reschedule`, `commissions.override` …) | Seeded |
| `role_permissions` | role_id, permission_id | PK(role_id, permission_id) |
| `user_roles` | user_id, role_id | PK(user_id, role_id) |
| `sessions` | id (opaque, hashed), user_id, expires_at, ip, user_agent, revoked_at | Index(user_id) |
| `otp_challenges` | id, phone, purpose, code_hash, attempts, expires_at | TTL cleanup job |

## 2. Patients

| Table | Key columns | Notes |
| --- | --- | --- |
| `patients` | id, owner_user_id (FK users, nullable for walk-ins), relationship (`SELF`,`CHILD`,`PARENT`,`SPOUSE`,`OTHER`), full_name, gender (`MALE`/`FEMALE`), date_of_birth (nullable), age_years_at_registration (nullable), phone, email, medical_record_no (unique, generated) | One user → many patients (family). `CHECK (date_of_birth IS NOT NULL OR age_years_at_registration IS NOT NULL)` |
| `patient_clinical_notes` | id, patient_id, appointment_id (nullable), author_practitioner_id, body (encrypted at the application level), visibility (`CLINICAL`,`ADMIN`) | Access is restricted and every read is audited |
| `patient_internal_notes` | id, patient_id, author_user_id, body | Reception/admin operational notes (non-clinical) |

Index: `patients(phone)`, trigram index on `full_name` for search.

## 3. Catalogue

| Table | Key columns | Notes |
| --- | --- | --- |
| `service_categories` | id, slug, name, kind (`PHYSIOTHERAPY`,`CONSULTANCY`), sort_order | |
| `services` | id, category_id, slug (unique), name, summary, description (rich text JSON), benefits_for (jsonb), approach (jsonb), what_to_expect (jsonb), duration_minutes, buffer_minutes, gender_policy (`REQUIRED_SAME_GENDER`,`PREFERRED`,`NONE`), booking_mode (`AUTO_CONFIRM`,`REQUIRES_APPROVAL`), allow_practitioner_choice, min_lead_minutes, max_days_ahead, cancellation_cutoff_minutes, is_active, is_featured, image_id, seo (jsonb), sort_order | All booking rules are per service |
| `service_relations` | service_id, related_service_id | "Related services" |

## 4. Practitioners & scheduling

| Table | Key columns | Notes |
| --- | --- | --- |
| `practitioners` | id, user_id (nullable, for portal login), display_name, gender, designation, qualifications (jsonb), specialization, experience_years (nullable), bio, photo_id, is_public, is_active, default_session_minutes, max_parallel (default 1) | `max_parallel` > 1 allows group sessions later |
| `practitioner_services` | practitioner_id, service_id, custom_duration_minutes (nullable) | PK(practitioner_id, service_id) |
| `availability_rules` | id, practitioner_id, kind (`WEEKLY`,`EVERY_N_WEEKS`,`MONTHLY_NTH_WEEKDAY`,`SPECIFIC_DATE`), weekdays int[] (0=Sun), interval_weeks, anchor_date, nth_of_month int[], specific_date, start_time (`time`), end_time, breaks (jsonb `[{start,end}]`), service_ids uuid[] (nullable = all offered), effective_from (date), effective_to (date, nullable) | Effective dated. Edits close the old rule and open a new one. |
| `availability_exceptions` | id, practitioner_id, date, kind (`UNAVAILABLE`,`EXTRA`), start_time, end_time (nullable = whole day), reason | Leave, holidays, extra sessions |
| `time_blocks` | id, practitioner_id (nullable = whole clinic), starts_at, ends_at, reason, created_by | Admin-blocked time |
| `clinic_holidays` | date, name | Applies to all practitioners |

## 5. Appointments (concurrency-critical)

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE appointments (
  id                      uuid PRIMARY KEY,
  reference               text UNIQUE NOT NULL,          -- FMR-XXXX-XXXX, no PII
  patient_id              uuid NOT NULL REFERENCES patients(id),
  booked_by_user_id       uuid REFERENCES users(id),      -- null for guest / staff-created
  service_id              uuid NOT NULL REFERENCES services(id),
  assigned_practitioner_id uuid NOT NULL REFERENCES practitioners(id),
  treating_practitioner_id uuid REFERENCES practitioners(id), -- set at completion; may differ
  starts_at               timestamptz NOT NULL,
  ends_at                 timestamptz NOT NULL,
  status                  appointment_status NOT NULL,   -- PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, REJECTED, NO_SHOW
  source                  text NOT NULL,                 -- WEB, ADMIN, WALK_IN, PHONE
  reason_for_visit        text,                          -- visible to staff only
  assignment_mode         text NOT NULL,                 -- AUTO, MANUAL, PATIENT_CHOICE
  created_at, updated_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at),
  -- hard guarantee against double booking for "active" statuses:
  EXCLUDE USING gist (
    assigned_practitioner_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (status IN ('PENDING','CONFIRMED','IN_PROGRESS'))
);
CREATE INDEX ON appointments (starts_at);
CREATE INDEX ON appointments (assigned_practitioner_id, starts_at);
CREATE INDEX ON appointments (patient_id, starts_at DESC);
```

> Prisma cannot express exclusion constraints, so this one is added in a **raw SQL migration**. The repository maps PG error `23P01` to `409 SLOT_TAKEN`.

| Table | Key columns | Notes |
| --- | --- | --- |
| `appointment_status_history` | id, appointment_id, from_status, to_status, changed_by_user_id, reason, metadata (jsonb: old/new time, old/new practitioner), created_at | Append-only. Rescheduling and reassignment are recorded here. |
| `appointment_charges` | appointment_id (PK), list_price, discount_amount, discount_reason, membership_id (nullable), net_amount, currency (`BDT`), payment_status (`UNPAID`,`PARTIALLY_PAID`,`PAID`,`REFUNDED`,`WAIVED`) | Price snapshot taken at booking |

## 6. Pricing

| Table | Key columns |
| --- | --- |
| `price_items` | id, kind (`SESSION`,`PACKAGE`,`CONSULTATION`,`OFFER`), service_id (nullable), name, description, sessions_included (packages), amount, compare_at_amount (promotional), valid_from, valid_to, is_published, sort_order |
| `patient_packages` | id, patient_id, price_item_id, sessions_total, sessions_used, purchased_at, expires_at |

## 7. Membership

| Table | Key columns | Notes |
| --- | --- | --- |
| `membership_plans` | id, slug, name, description, billing_period (`MONTHLY`,`QUARTERLY`,`ANNUAL`), duration_days, price, is_active, is_public, sort_order | |
| `plan_entitlements` | plan_id, key (`nira.access`, `nira.daily_messages`, `discount.percent.physio` …), value (jsonb) | Plans change over time, so entitlements are **snapshotted** onto the membership |
| `memberships` | id, user_id, plan_id, status (`PENDING_PAYMENT`,`ACTIVE`,`EXPIRED`,`SUSPENDED`,`CANCELLED`), starts_at, ends_at, entitlements_snapshot (jsonb), auto_renew, suspended_reason | Partial unique index: one `ACTIVE` per user |
| `membership_transactions` | id, membership_id, type (`PURCHASE`,`RENEWAL`,`UPGRADE`,`DOWNGRADE`,`SUSPEND`,`RESUME`,`CANCEL`), payment_id, actor_user_id, created_at | |

## 8. Payments

| Table | Key columns | Notes |
| --- | --- | --- |
| `payments` | id, payer_user_id, purpose (`APPOINTMENT`,`MEMBERSHIP`,`PACKAGE`), purpose_id, provider (`CASH`,`MANUAL`,`BKASH`,`NAGAD`,`GATEWAY`), provider_txn_id, amount, status (`INITIATED`,`PENDING_VERIFICATION`,`SUCCEEDED`,`FAILED`,`CANCELLED`), verified_by_user_id, verified_at, raw_payload (jsonb) | Unique(provider, provider_txn_id) gives idempotency |
| `refunds` | id, payment_id, amount, reason, status, actor_user_id | |

## 9. Commissions

| Table | Key columns | Notes |
| --- | --- | --- |
| `commission_rules` | id, practitioner_id (nullable), service_id (nullable), type (`PERCENTAGE`,`FIXED`), rate_bps (for %) or fixed_amount, base (`NET_AFTER_DISCOUNT`,`GROSS`), effective_from, effective_to | **Never updated after use.** Change = close + new row. |
| `practitioner_commissions` | id, appointment_id (unique), practitioner_id (treating), rule_id, rule_snapshot (jsonb), base_amount, computed_amount, override_amount (nullable), override_reason, overridden_by, status (`PENDING_PAYMENT`,`PAYABLE`,`SETTLED`,`VOID`), settlement_id | Snapshot taken at completion |
| `commission_settlements` | id, practitioner_id, period_start, period_end, total_amount, paid_at, paid_by, payment_reference, notes | |

## 10. Notifications, Nira, CMS, audit

| Table | Key columns |
| --- | --- |
| `notification_templates` | id, event, channel, locale (`en`,`bn`), subject, body (handlebars), is_active |
| `notifications` | id, event, recipient_user_id / phone / email, payload (jsonb, minimal), created_at |
| `notification_deliveries` | id, notification_id, channel, provider, status (`QUEUED`,`SENT`,`FAILED`,`NOT_CONFIGURED`), provider_message_id, error, attempts |
| `nira_conversations` | id, user_id, title, created_at, archived_at |
| `nira_messages` | id, conversation_id, role (`user`,`assistant`,`system`), content, tokens_in, tokens_out, safety_flags (jsonb) |
| `nira_usage` | user_id, date, messages, tokens — PK(user_id, date) |
| `cms_pages` | id, key (`home`,`about`,`our-story`…), title, seo (jsonb), status (`DRAFT`,`PUBLISHED`), published_at |
| `cms_sections` | id, page_id, key (`hero`,`approach`…), type, content (jsonb, validated by section schema), sort_order, is_visible |
| `testimonials` | id, author_display (initials allowed), context, quote, rating (nullable), consent_recorded (bool, required to publish), is_published |
| `faqs` | id, category, question, answer, sort_order, is_published |
| `announcements` | id, message, link, starts_at, ends_at, is_published |
| `site_settings` | key (`contact`,`opening_hours`,`social`,`booking_defaults`), value (jsonb) |
| `media_assets` | id, storage_key, mime, width, height, alt, uploaded_by |
| `audit_logs` | id (bigserial), actor_user_id, action, entity, entity_id, before (jsonb), after (jsonb), ip, created_at. **Append-only** (DB role without UPDATE/DELETE). |

## 11. Seed data (Phase 2)

Roles and permissions, service categories, the service catalogue (descriptions only, **no prices**), CMS page shells with placeholder copy, and one `SUPER_ADMIN` from env vars. No real patient data is ever seeded.
