"use client";

import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Button, ButtonAnchor } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Alert, Skeleton, Spinner } from "@/components/ui/feedback";
import { Overlay } from "@/components/ui/overlay";
import { MembershipStatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { env } from "@/config/env";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import { api } from "@/services";
import type { PaymentMethod } from "@/types/admin";
import type { MembershipPlan } from "@/types/membership";

const METHODS: { value: PaymentMethod; label: string; description: string; available: boolean }[] = [
  { value: "CASH", label: "Pay at the clinic", description: "Pay at reception; your membership activates once payment is recorded.", available: true },
  { value: "MANUAL", label: "bKash / Nagad transfer", description: "Send to the clinic's merchant number and share the transaction ID. Staff verify it manually.", available: true },
  { value: "BKASH", label: "bKash online checkout", description: "Coming soon — integration pending merchant credentials.", available: false },
  { value: "GATEWAY", label: "Card / online gateway", description: "Coming soon — integration pending.", available: false },
];

export function MyMembership() {
  const { notify } = useToast();
  const membership = useAsync(() => api.account.getMembership(), []);
  const plans = useAsync(() => api.pricing.listPlans(), []);
  const [choosing, setChoosing] = useState<MembershipPlan | null>(null);
  const m = membership.data;
  const canPurchase = m && (m.status === "NONE" || m.status === "EXPIRED" || m.status === "CANCELLED");

  return (
    <div className="space-y-8">
      <PageTitle title="Membership" description="Membership is optional — your free account already lets you book appointments." />
      {membership.loading || !m ? (
        <Skeleton className="h-36 rounded-2xl" />
      ) : (
        <Card>
          <CardBody className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <MembershipStatusBadge status={m.status} />
              <p className="font-display text-2xl text-teal-deep">{m.planName ?? "Free account"}</p>
              <p className="text-sm text-ink-soft">
                {m.status === "ACTIVE" && m.endsAt && `Renews or expires on ${formatDate(m.endsAt)}. Nira access is active.`}
                {m.status === "NONE" && "Upgrade to unlock member pricing, priority booking and Nira."}
                {m.status === "PENDING_PAYMENT" && "We've recorded your request. Access to member benefits — including Nira — starts once staff verify your payment."}
                {m.status === "EXPIRED" && "Your membership has expired, so member benefits and Nira are no longer available."}
                {m.status === "SUSPENDED" && "Your membership is suspended. Please contact the clinic."}
              </p>
            </div>
            {m.status === "ACTIVE" && m.entitlements["nira.access"] === true && (
              <ButtonAnchor href={env.niraUrl} variant="accent">
                <Sparkles className="size-4" /> Open Nira
              </ButtonAnchor>
            )}
          </CardBody>
        </Card>
      )}

      <section>
        <h2 className="mb-4 text-xl font-medium text-teal-deep">Plans</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.loading
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-72 rounded-2xl" />)
            : (plans.data ?? []).map((p) => (
                <article key={p.id} className={cn("flex flex-col rounded-2xl border bg-white p-5", p.isHighlighted ? "border-teal" : "border-line")}>
                  <p className="font-display text-xl text-teal-deep">{p.name}</p>
                  <p className="text-sm text-ink-soft">{p.tagline}</p>
                  <p className="mt-3 font-display text-3xl text-teal">{formatMoney(p.price)}</p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm">
                    {p.benefits.map((b) => (
                      <li key={b} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-sage" /> {b}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-5" variant={p.isHighlighted ? "primary" : "secondary"} disabled={!canPurchase} onClick={() => setChoosing(p)}>
                    {m?.planId === p.id && !canPurchase ? "Current plan" : "Choose plan"}
                  </Button>
                </article>
              ))}
        </div>
        {!canPurchase && m?.status !== "NONE" && <p className="mt-3 text-xs text-ink-soft">Plan changes for existing memberships are handled by the clinic (upgrade/downgrade rules pending confirmation).</p>}
      </section>

      <PurchaseDialog
        plan={choosing}
        onClose={() => setChoosing(null)}
        onDone={(state) => {
          membership.setData(state);
          notify("Membership requested — awaiting payment verification.");
        }}
      />
    </div>
  );
}

function PurchaseDialog({ plan, onClose, onDone }: { plan: MembershipPlan | null; onClose: () => void; onDone: (s: Awaited<ReturnType<typeof api.account.purchaseMembership>>) => void }) {
  const [method, setMethod] = useState<PaymentMethod>("CASH");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!plan) return null;
  async function submit() {
    setPending(true);
    setError(null);
    try {
      onDone(await api.account.purchaseMembership(plan!.id, method));
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPending(false);
    }
  }
  return (
    <Overlay
      open
      onClose={onClose}
      title={`Join ${plan.name}`}
      description={`${formatMoney(plan.price)} · ${plan.durationDays} days`}
      footer={
        <Button onClick={submit} disabled={pending}>
          {pending && <Spinner />} Request membership
        </Button>
      }
    >
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold text-ink">Payment method</legend>
        {METHODS.filter((m) => m.available).map((m) => (
          <label key={m.value} className={cn("flex cursor-pointer gap-3 rounded-xl border p-3.5", method === m.value ? "border-teal bg-mist" : "border-line", !m.available && "cursor-not-allowed opacity-50")}>
            <input type="radio" name="method" value={m.value} disabled={!m.available} checked={method === m.value} onChange={() => setMethod(m.value)} className="mt-1 accent-teal" />
            <span>
              <span className="block text-sm font-semibold text-ink">{m.label}</span>
              <span className="text-xs text-ink-soft">{m.description}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <Alert tone="info" className="mt-4">
        Membership access (including Nira) is granted by the server only after payment is verified.
      </Alert>
      {error && <Alert tone="error" className="mt-4">{error}</Alert>}
    </Overlay>
  );
}
