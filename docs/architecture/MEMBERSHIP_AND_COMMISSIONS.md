# Memberships, Payments & Commissions

## 1. Membership

### Status model

```text
            purchase
NONE ──────────────────▶ PENDING_PAYMENT ──payment verified──▶ ACTIVE ──ends_at passes──▶ EXPIRED
                                 │                               │  ▲
                                 └──timeout/cancel──▶ CANCELLED  │  └──resume── SUSPENDED ◀──suspend (admin)
                                                                 └──renew (extends ends_at; new transaction)
```

- A user has **at most one `ACTIVE` membership**, enforced by a partial unique index.
- An upgrade starts the new plan immediately. Remaining value is pro-rated as credit; the exact formula is still an open question (defaults to no pro-ration). A downgrade takes effect at the next renewal.
- **Access checks never trust a stored flag alone.** The membership counts as active when `status = 'ACTIVE' AND now() < ends_at`. The nightly `ExpireMemberships` job only tidies the status column and sends notifications.

### Entitlements

Plans define entitlements, and these are **snapshotted** onto each membership when it is bought, so editing a plan never silently changes what an existing member paid for.

| Key | Example value | Used by |
| --- | --- | --- |
| `nira.access` | `true` | Nira API guard |
| `nira.daily_messages` | `50` | Nira quota |
| `discount.percent.physiotherapy` | `10` | Pricing at booking |
| `priority_booking.days_ahead` | `30` | Booking window override |

## 2. Payments

```ts
interface PaymentProvider {
  readonly key: 'CASH' | 'MANUAL' | 'BKASH' | 'NAGAD' | 'GATEWAY';
  isConfigured(): boolean;
  createIntent(input: { paymentId: string; amount: Money; returnUrl: string }): Promise<IntentResult>;
  verify(paymentId: string): Promise<VerifyResult>;
  refund(paymentId: string, amount: Money): Promise<RefundResult>;
  handleWebhook?(req: RawRequest): Promise<WebhookResult>;
}
```

- `CASH`: recorded by reception. Succeeds immediately and stores who received it.
- `MANUAL`: the patient pays by bKash/Nagad personal or merchant number and enters the transaction id. Status becomes `PENDING_VERIFICATION` until staff verify it.
- `BKASH` / `NAGAD` / `GATEWAY`: adapters exist but `isConfigured()` returns false until credentials are set. The API then returns `PROVIDER_NOT_CONFIGURED`, and the UI hides those options.
- Webhooks are verified by signature and are idempotent on `(provider, provider_txn_id)`.

## 3. Commission engine

### Rule resolution (most specific wins)

For appointment `A` (treating practitioner `P`, service `S`, local date `D`):

1. rule where `practitioner_id = P AND service_id = S`
2. rule where `practitioner_id = P AND service_id IS NULL`
3. rule where `practitioner_id IS NULL AND service_id = S`
4. clinic default (`both NULL`)

Each step only considers rules with `effective_from ≤ D < effective_to`.

### Calculation

```
base   = rule.base == 'GROSS' ? charge.listPrice : charge.netAmount     // Q5 default NET
amount = rule.type == 'PERCENTAGE' ? round_half_up(base × rate_bps / 10000) : rule.fixed_amount
```

All values are integers in poisha. Rounding is half-up to the nearest poisha.

### Lifecycle

```text
appointment COMPLETED ─▶ snapshot row (status PENDING_PAYMENT, or PAYABLE if charge PAID/WAIVED)
charge becomes PAID   ─▶ PAYABLE
settlement created    ─▶ SETTLED (settlement_id set)
appointment reverted / refunded in full ─▶ VOID (only if not SETTLED; otherwise negative adjustment row)
```

- An override sets `override_amount`, `override_reason` and `overridden_by`, and writes an `audit_logs` row. The **effective amount** is `coalesce(override_amount, computed_amount)`.
- Historical rows are **never** recalculated when rules change. A new rule only affects appointments completed on or after its `effective_from`.

### Required unit tests (backend, Phase 7)

- percentage vs fixed;
- the precedence order;
- the effective-date boundary (the day before and the day of a change);
- assigned ≠ treating practitioner;
- a discounted fee with base NET vs GROSS;
- an override with audit entry;
- a refund after settlement producing an adjustment.
