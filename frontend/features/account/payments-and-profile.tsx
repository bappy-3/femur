"use client";

import { ReceiptText } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { EmptyState, Skeleton, Spinner } from "@/components/ui/feedback";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { formatDate } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import { titleCase } from "@/lib/strings";
import { api } from "@/services";

const PAYMENT_TONE = { SUCCEEDED: "mint", PENDING_VERIFICATION: "sand", INITIATED: "sky", FAILED: "rose", REFUNDED: "slate" } as const;

export function MyPayments() {
  const { data, loading } = useAsync(() => api.account.listPayments(), []);
  return (
    <div>
      <PageTitle title="Payments" description="Receipts for appointments and memberships." />
      {loading ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : (data ?? []).length === 0 ? (
        <EmptyState icon={<ReceiptText className="size-5" />} title="No payments yet" description="Payments recorded at the clinic or online will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[36rem] text-sm">
            <thead className="bg-mist/60 text-left text-xs tracking-wide text-ink-soft uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">For</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(data ?? []).map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    {titleCase(p.purpose)} <span className="font-mono text-xs text-ink-soft">{p.reference}</span>
                  </td>
                  <td className="px-4 py-3">{p.method === "MANUAL" ? "bKash/Nagad (manual)" : titleCase(p.method)}</td>
                  <td className="px-4 py-3 text-right font-semibold">{formatMoney(p.amount)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={PAYMENT_TONE[p.status]}>{titleCase(p.status)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function MyProfile() {
  const { notify } = useToast();
  const me = useAsync(() => api.auth.me(), []);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim() || null;
    if (fullName.length < 2) return notify("Please enter your full name.", "error");
    setPending(true);
    try {
      await api.account.updateProfile({ fullName, email });
      notify("Profile updated.");
    } catch (err) {
      notify(errorMessage(err), "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <PageTitle title="Profile" description="Your account details." />
      <Card>
        <CardBody>
          {me.loading || !me.data ? (
            <Skeleton className="h-48" />
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <Field label="Full name" htmlFor="pf-name">
                <Input id="pf-name" name="fullName" defaultValue={me.data.fullName} />
              </Field>
              <Field label="Mobile number" htmlFor="pf-phone" hint="Changing your number requires OTP verification (available once SMS is connected).">
                <Input id="pf-phone" defaultValue={me.data.phone} disabled />
              </Field>
              <Field label="Email" htmlFor="pf-email" optional>
                <Input id="pf-email" name="email" type="email" defaultValue={me.data.email ?? ""} />
              </Field>
              <Button type="submit" disabled={pending}>
                {pending && <Spinner />} Save changes
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
