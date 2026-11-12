# Booking & Scheduling Engine

> The backend (`modules/schedules`, `modules/appointments`) owns all of this logic. The frontend wizard only displays what the API returns. The frontend mock adapter (`frontend/services/mock/scheduling.ts`) implements a **simplified copy** so the UI can be exercised without a backend. It is not authoritative.

## 1. Inputs

- **Service** settings: `durationMinutes`, `bufferMinutes`, `genderPolicy`, `bookingMode`, `minLeadMinutes`, `maxDaysAhead`, `allowPractitionerChoice`.
- **Practitioner**: active flag, gender, services offered, availability rules, exceptions, time blocks.
- **Existing appointments** in active statuses (`PENDING`, `CONFIRMED`, `IN_PROGRESS`).
- **Holds** in Redis (`hold:{practitionerId}:{startsAtISO}` with TTL).
- **Clinic holidays**.

## 2. Gender policy

| Policy | Candidate practitioners | Typical use |
| --- | --- | --- |
| `REQUIRED_SAME_GENDER` | Only practitioners whose `gender = patient.gender` | Physiotherapy, pain management, pregnancy, sports, posture … |
| `PREFERRED` | Same gender first. Others are used if no same-gender slot exists, and the UI says so. | Optional |
| `NONE` | All practitioners offering the service | Dental, eye care, nutrition, general medicine (pending Q1) |

Admin-created bookings may override `REQUIRED_SAME_GENDER` only with a recorded reason, which is audited.

## 3. Expanding rules for a date `D` (Asia/Dhaka)

```
for rule in practitioner.rules where effective_from ≤ D ≤ coalesce(effective_to, ∞):
  WEEKLY:              D.weekday ∈ rule.weekdays
  EVERY_N_WEEKS:       D.weekday == rule.weekday AND weeksBetween(anchor, D) % interval == 0
  MONTHLY_NTH_WEEKDAY: D.weekday == rule.weekday AND nthOccurrenceInMonth(D) ∈ rule.nth
  SPECIFIC_DATE:       D == rule.date
→ interval [D start_time, D end_time) minus rule.breaks
union with EXTRA exceptions; subtract UNAVAILABLE exceptions, clinic holidays, time blocks
```

## 4. Slot generation

```
step = service.duration (+ buffer)
for each free interval [a, b):
  t = ceilToGrid(a, 15 min)
  while t + duration ≤ b:
     if t ≥ now + minLead and D ≤ today + maxDaysAhead and no overlap(appointments ∪ holds):
        emit (practitionerId, t, t+duration)
     t += step
group by t → { startsAt, endsAt, availableCount }
```

The date picker calls `/availability/dates` for a range. That endpoint runs the same expansion and only reports `hasSlots`, using a 60-second Redis cache keyed by `(service, gender, date)` that is invalidated on any booking change.

## 5. Assignment

1. If `allowPractitionerChoice` is set and the patient chose someone, use that practitioner (re-verified).
2. Otherwise **auto-assign**: among free candidates at `t`, pick the practitioner with the fewest active appointments that day. Ties go to the earliest `created_at`, so the result is deterministic and testable.
3. The appointment stores `assigned_practitioner_id`. `treating_practitioner_id` is set when the appointment completes, and defaults to the assigned practitioner unless reception changes it. Commission uses the **treating** practitioner.

## 6. Concurrency guarantees

| Layer | Purpose |
| --- | --- |
| Redis hold (`SET NX PX 300000`) | Stops two patients in the wizard picking the same slot (UX nicety) |
| Re-verification inside the transaction | Slot still within rules/window |
| **PostgreSQL exclusion constraint** | The hard guarantee. Overlapping active appointments for the same practitioner cannot both be committed. |
| `Idempotency-Key` | Double-clicks and retries don't create duplicates |

Required test (Phase 9): 50 concurrent `POST /appointments` for the same slot with one eligible practitioner gives exactly 1 × `201` and 49 × `409 SLOT_TAKEN`.

## 7. Status machine

| From → To | Who | Side-effects |
| --- | --- | --- |
| `PENDING → CONFIRMED` | Reception/Admin | Notify patient |
| `PENDING → REJECTED` | Reception/Admin (reason required) | Notify, release slot |
| `PENDING/CONFIRMED → CANCELLED` | Patient (before cut-off) / Staff | Notify, release slot, refund rules |
| `CONFIRMED → IN_PROGRESS` | Reception (check-in) | |
| `CONFIRMED/IN_PROGRESS → COMPLETED` | Practitioner/Reception | Set treating practitioner → commission snapshot |
| `CONFIRMED → NO_SHOW` | Reception (after start time) | Release nothing (time is past) |
| Reschedule (`PENDING/CONFIRMED`) | Patient (before cut-off) / Staff | Same constraint checks, history row with old/new time |

Every transition writes `appointment_status_history`. An invalid transition returns `409 INVALID_STATUS_TRANSITION`.

## 8. Time zone

Dhaka is UTC+06:00 with no DST. We still never hand-roll offsets in the backend. We use `Temporal`/`date-fns-tz` with the `Asia/Dhaka` zone, so the code stays correct if the rule ever changes. API inputs and outputs are UTC instants. Dates are always Dhaka calendar dates.
