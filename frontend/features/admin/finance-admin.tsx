"use client";

import { CheckCircle2, Download, PlugZap } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, EmptyState, Skeleton, Spinner } from "@/components/ui/feedback";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Overlay } from "@/components/ui/overlay";
import { useToast } from "@/components/ui/toast";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/cn";
import { downloadCsv } from "@/lib/csv";
import { formatDate } from "@/lib/datetime";
import { formatMoney, sumMoney } from "@/lib/money";
import { titleCase } from "@/lib/strings";
import { api } from "@/services";
import type { CommissionRecord, CommissionStatus } from "@/types/admin";
import { DateRangeFilter, PRESETS, type Range } from "./date-range";

const C_TONE = { PENDING_PAYMENT: "sand", PAYABLE: "teal", SETTLED: "mint", VOID: "slate" } as const;
const P_TONE = { SUCCEEDED: "mint", PENDING_VERIFICATION: "sand", INITIATED: "sky", FAILED: "rose", REFUNDED: "slate" } as const;
const effective = (c: CommissionRecord) => c.overrideAmount ?? c.computedAmount;

export function FinanceAdmin() {
  const { notify } = useToast();
  const [range, setRange] = useState<Range>(PRESETS[2].range());
  const [practitionerId, setPractitionerId] = useState("");
  const [status, setStatus] = useState<CommissionStatus | "">("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [overriding, setOverriding] = useState<CommissionRecord | null>(null);
  const [settling, setSettling] = useState(false);
  const commissions = useAsync(() => api.admin.listCommissions({ ...range, practitionerId, status }), [range.from, range.to, practitionerId, status]);
  const payments = useAsync(() => api.admin.listPayments(range), [range.from, range.to]);
  const practitioners = useAsync(() => api.admin.listPractitioners(), []);
  const providers = useAsync(() => api.admin.providerStatus(), []);

  const rows = commissions.data ?? [];
  const pays = payments.data ?? [];
  const revenue = sumMoney(pays.filter((p) => p.status === "SUCCEEDED").map((p) => p.amount));
  const apptRevenue = sumMoney(pays.filter((p) => p.status === "SUCCEEDED" && p.purpose === "APPOINTMENT").map((p) => p.amount));
  const memberRevenue = sumMoney(pays.filter((p) => p.status === "SUCCEEDED" && p.purpose === "MEMBERSHIP").map((p) => p.amount));
  const payable = rows.filter((c) => c.status === "PAYABLE");
  const selectedPayable = payable.filter((c) => selected.has(c.id));

  async function verify(id: string) {
    try {
      const p = await api.admin.verifyPayment(id);
      payments.setData((prev) => (prev ?? []).map((x) => (x.id === id ? p : x)));
      commissions.reload();
      notify("Payment verified.");
    } catch (e) {
      notify(errorMessage(e), "error");
    }
  }

  async function settle() {
    setSettling(true);
    try {
      const done = await api.admin.settleCommissions([...selected]);
      setSelected(new Set());
      commissions.reload();
      notify(`${done.length} commissions settled (${formatMoney(sumMoney(done.map(effective)))}).`);
    } catch (e) {
      notify(errorMessage(e), "error");
    } finally {
      setSettling(false);
    }
  }

  function exportCommissions() {
    downloadCsv(`commissions_${range.from}_${range.to}.csv`, [
      ["Completed", "Reference", "Practitioner (treating)", "Service", "Base (BDT)", "Rule", "Computed (BDT)", "Override (BDT)", "Override reason", "Status"],
      ...rows.map((c) => [formatDate(c.completedAt), c.appointmentReference, c.practitionerName, c.serviceName, c.baseAmount.amount / 100, c.ruleLabel, c.computedAmount.amount / 100, c.overrideAmount ? c.overrideAmount.amount / 100 : "", c.overrideReason ?? "", c.status]),
    ]);
  }

  const byPractitioner = Object.values(
    rows.reduce<Record<string, { name: string; sessions: number; total: number; unpaid: number }>>((acc, c) => {
      const r = (acc[c.practitionerId] ??= { name: c.practitionerName, sessions: 0, total: 0, unpaid: 0 });
      r.sessions += 1;
      r.total += effective(c).amount;
      if (c.status !== "SETTLED") r.unpaid += effective(c).amount;
      return acc;
    }, {}),
  ).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <PageTitle title="Finance & commissions" description="Revenue, payment verification and practitioner commission settlement." />
      <DateRangeFilter value={range} onChange={setRange} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total revenue", value: formatMoney(revenue) },
          { label: "Appointment revenue", value: formatMoney(apptRevenue) },
          { label: "Membership revenue", value: formatMoney(memberRevenue) },
          { label: "Commission payable", value: formatMoney(sumMoney(payable.map(effective))) },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody>
              <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{s.label}</p>
              <p className="mt-2 font-display text-[1.75rem] leading-none text-teal-deep">{s.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex-wrap">
          <CardTitle>Practitioner commissions</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Select aria-label="Practitioner" value={practitionerId} onChange={(e) => setPractitionerId(e.target.value)} className="h-9 w-auto rounded-full text-sm">
              <option value="">All practitioners</option>
              {(practitioners.data ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName}
                </option>
              ))}
            </Select>
            <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as CommissionStatus | "")} className="h-9 w-auto rounded-full text-sm">
              <option value="">All statuses</option>
              {Object.keys(C_TONE).map((s) => (
                <option key={s} value={s}>
                  {titleCase(s)}
                </option>
              ))}
            </Select>
            <Button size="sm" variant="secondary" onClick={exportCommissions} disabled={rows.length === 0}>
              <Download className="size-4" /> CSV
            </Button>
            <Button size="sm" onClick={settle} disabled={selectedPayable.length === 0 || settling}>
              {settling && <Spinner />} Settle {selectedPayable.length > 0 ? `${selectedPayable.length} (${formatMoney(sumMoney(selectedPayable.map(effective)))})` : "selected"}
            </Button>
          </div>
        </CardHeader>
        {byPractitioner.length > 0 && (
          <div className="flex gap-3 overflow-x-auto border-b border-line px-5 py-3">
            {byPractitioner.map((p) => (
              <div key={p.name} className="shrink-0 rounded-xl bg-mist/60 px-3.5 py-2 text-xs">
                <p className="font-semibold text-ink">{p.name}</p>
                <p className="text-ink-soft">
                  {p.sessions} sessions · {formatMoney({ amount: p.total, currency: "BDT" })} · unsettled {formatMoney({ amount: p.unpaid, currency: "BDT" })}
                </p>
              </div>
            ))}
          </div>
        )}
        {commissions.loading && !commissions.data ? (
          <Skeleton className="m-5 h-48" />
        ) : rows.length === 0 ? (
          <EmptyState className="m-5" title="No commissions in this range" description="Commissions are created when a session is marked completed." />
        ) : (
          <div className="max-h-[32rem] overflow-auto">
            <table className="w-full min-w-[60rem] text-sm">
              <thead className="sticky top-0 bg-white text-left text-xs tracking-wide text-ink-soft uppercase">
                <tr>
                  <th className="w-10 px-5 py-2.5">
                    <input
                      type="checkbox"
                      aria-label="Select all payable"
                      className="accent-teal"
                      checked={payable.length > 0 && payable.every((c) => selected.has(c.id))}
                      onChange={(e) => setSelected(e.target.checked ? new Set(payable.map((c) => c.id)) : new Set())}
                    />
                  </th>
                  {["Completed", "Practitioner", "Service", "Base", "Rule (snapshot)", "Commission", "Status", ""].map((h) => (
                    <th key={h} className="px-3 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((c) => (
                  <tr key={c.id} className={cn(selected.has(c.id) && "bg-mist/50")}>
                    <td className="px-5 py-2.5">
                      <input
                        type="checkbox"
                        aria-label={`Select ${c.appointmentReference}`}
                        className="accent-teal"
                        disabled={c.status !== "PAYABLE"}
                        checked={selected.has(c.id)}
                        onChange={(e) => {
                          const next = new Set(selected);
                          if (e.target.checked) next.add(c.id);
                          else next.delete(c.id);
                          setSelected(next);
                        }}
                      />
                    </td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      {formatDate(c.completedAt)} <span className="block font-mono text-[0.7rem] text-ink-soft">{c.appointmentReference}</span>
                    </td>
                    <td className="px-3 py-2.5">{c.practitionerName}</td>
                    <td className="px-3 py-2.5">{c.serviceName}</td>
                    <td className="px-3 py-2.5">{formatMoney(c.baseAmount)}</td>
                    <td className="px-3 py-2.5 text-xs text-ink-soft">{c.ruleLabel}</td>
                    <td className="px-3 py-2.5 font-semibold">
                      {formatMoney(effective(c))}
                      {c.overrideAmount && (
                        <span className="block text-[0.7rem] font-normal text-sand-deep" title={c.overrideReason ?? ""}>
                          overridden (was {formatMoney(c.computedAmount)})
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge tone={C_TONE[c.status]}>{titleCase(c.status)}</Badge>
                    </td>
                    <td className="px-3 py-2.5">
                      {c.status !== "SETTLED" && c.status !== "VOID" && (
                        <Button size="sm" variant="ghost" onClick={() => setOverriding(c)}>
                          Override
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <span className="text-xs text-ink-soft">{pays.filter((p) => p.status === "PENDING_VERIFICATION").length} awaiting verification</span>
          </CardHeader>
          <div className="max-h-96 overflow-auto">
            <table className="w-full min-w-[40rem] text-sm">
              <tbody className="divide-y divide-line">
                {pays.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-2.5 whitespace-nowrap">{formatDate(p.createdAt)}</td>
                    <td className="px-3 py-2.5">
                      {p.payerName}
                      <span className="block text-xs text-ink-soft">
                        {titleCase(p.purpose)} · {p.reference}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">{p.method === "MANUAL" ? "bKash/Nagad (manual)" : titleCase(p.method)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold">{formatMoney(p.amount)}</td>
                    <td className="px-3 py-2.5">
                      <Badge tone={P_TONE[p.status]}>{titleCase(p.status)}</Badge>
                    </td>
                    <td className="px-5 py-2.5">
                      {p.status === "PENDING_VERIFICATION" && (
                        <Button size="sm" variant="secondary" onClick={() => verify(p.id)}>
                          <CheckCircle2 className="size-4" /> Verify
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
            <PlugZap className="size-4 text-sage" />
          </CardHeader>
          <ul className="divide-y divide-line text-sm">
            {(providers.data ?? []).map((p) => (
              <li key={p.key} className="flex items-center justify-between px-5 py-2.5">
                <span>{p.label}</span>
                <Badge tone={p.configured ? "mint" : "slate"}>{p.configured ? "Connected" : "Not configured"}</Badge>
              </li>
            ))}
          </ul>
          <p className="px-5 pb-4 text-xs text-ink-soft">Providers become available once credentials are configured on the server. Nothing is reported as sent or paid until a provider confirms it.</p>
        </Card>
      </div>

      {overriding && (
        <OverrideDialog
          record={overriding}
          onClose={() => setOverriding(null)}
          onDone={(c) => {
            commissions.setData((prev) => (prev ?? []).map((x) => (x.id === c.id ? c : x)));
            notify("Commission overridden. Recorded in the audit log.");
          }}
        />
      )}
    </div>
  );
}

function OverrideDialog({ record, onClose, onDone }: { record: CommissionRecord; onClose: () => void; onDone: (c: CommissionRecord) => void }) {
  const [amount, setAmount] = useState(String(effective(record).amount / 100));
  const [reason, setReason] = useState(record.overrideReason ?? "");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit() {
    setPending(true);
    setError(null);
    try {
      onDone(await api.admin.overrideCommission(record.id, Math.round(Number(amount) * 100), reason));
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPending(false);
    }
  }
  return (
    <Overlay open onClose={onClose} title="Override commission" description={`${record.appointmentReference} · ${record.practitionerName}`} footer={<Button onClick={submit} disabled={pending || !reason.trim()}>{pending && <Spinner />} Save override</Button>}>
      <div className="space-y-4">
        <p className="text-sm text-ink-soft">
          Calculated: <strong className="text-ink">{formatMoney(record.computedAmount)}</strong> ({record.ruleLabel}). The original calculation is kept for audit.
        </p>
        <Field label="New amount (৳)" htmlFor="ov-a">
          <Input id="ov-a" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </Field>
        <Field label="Reason (required)" htmlFor="ov-r">
          <Textarea id="ov-r" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} />
        </Field>
        {error && <Alert tone="error">{error}</Alert>}
      </div>
    </Overlay>
  );
}
