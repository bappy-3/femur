"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton, Spinner } from "@/components/ui/feedback";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Overlay } from "@/components/ui/overlay";
import { MembershipStatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { formatDate } from "@/lib/datetime";
import { bdt, formatMoney } from "@/lib/money";
import { titleCase } from "@/lib/strings";
import { api } from "@/services";
import type { MembershipPlan, PriceItem } from "@/types/membership";

const taka = (poisha: number) => poisha / 100;

export function PricingAdmin() {
  const { notify } = useToast();
  const items = useAsync(() => api.admin.listPriceItems(), []);
  const plans = useAsync(() => api.admin.listPlans(), []);
  const members = useAsync(() => api.admin.listMembers(), []);
  const services = useAsync(() => api.admin.listServices(), []);
  const [item, setItem] = useState<PriceItem | null>(null);
  const [plan, setPlan] = useState<MembershipPlan | null>(null);

  async function memberAction(id: string, action: "activate" | "suspend" | "resume" | "cancel") {
    try {
      const m = await api.admin.setMemberStatus(id, action);
      members.setData((prev) => (prev ?? []).map((x) => (x.id === id ? m : x)));
      notify(`Membership ${action}d.`);
    } catch (e) {
      notify(errorMessage(e), "error");
    }
  }

  return (
    <div className="space-y-6">
      <PageTitle title="Pricing & membership" description="All prices, packages, offers and membership plans are managed here — nothing is hard-coded on the website." />

      <Card>
        <CardHeader>
          <CardTitle>Price list</CardTitle>
          <Button size="sm" onClick={() => setItem({ id: `pi_${Date.now()}`, kind: "SESSION", serviceId: null, name: "", description: "", sessionsIncluded: 1, amount: bdt(0), compareAtAmount: null, validFrom: null, validTo: null, isPublished: false, sortOrder: 99 })}>
            <Plus className="size-4" /> Add price
          </Button>
        </CardHeader>
        {items.loading && !items.data ? (
          <Skeleton className="m-5 h-40" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-sm">
              <thead className="text-left text-xs tracking-wide text-ink-soft uppercase">
                <tr>
                  {["Name", "Type", "Price", "Compare at", "Valid until", "Status"].map((h) => (
                    <th key={h} className="px-5 py-2.5 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {(items.data ?? []).map((i) => (
                  <tr key={i.id} onClick={() => setItem(i)} className="cursor-pointer hover:bg-mist/40">
                    <td className="px-5 py-3 font-medium text-ink">{i.name}</td>
                    <td className="px-5 py-3">{titleCase(i.kind)}</td>
                    <td className="px-5 py-3 font-semibold">{formatMoney(i.amount)}</td>
                    <td className="px-5 py-3 text-ink-soft">{i.compareAtAmount ? formatMoney(i.compareAtAmount) : "—"}</td>
                    <td className="px-5 py-3 text-ink-soft">{i.validTo ? formatDate(i.validTo) : "—"}</td>
                    <td className="px-5 py-3">
                      <Badge tone={i.isPublished ? "mint" : "slate"}>{i.isPublished ? "Published" : "Hidden"}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Membership plans</CardTitle>
        </CardHeader>
        <div className="grid gap-3 p-5 md:grid-cols-3">
          {(plans.data ?? []).map((p) => (
            <button key={p.id} onClick={() => setPlan(p)} className="rounded-xl border border-line p-4 text-left hover:border-sage/60">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">{p.name}</p>
                <Badge tone={p.isActive ? "mint" : "slate"}>{p.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <p className="mt-1 font-display text-2xl text-teal">{formatMoney(p.price)}</p>
              <p className="text-xs text-ink-soft">
                {titleCase(p.billingPeriod)} · {p.durationDays} days · Nira {p.includesNira ? "included" : "not included"}
              </p>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <span className="text-xs text-ink-soft">Activation follows payment verification</span>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-sm">
            <thead className="text-left text-xs tracking-wide text-ink-soft uppercase">
              <tr>
                {["Member", "Plan", "Status", "Period", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(members.data ?? []).map((m) => (
                <tr key={m.id}>
                  <td className="px-5 py-3 font-medium text-ink">{m.userName}</td>
                  <td className="px-5 py-3">{m.planName}</td>
                  <td className="px-5 py-3">
                    <MembershipStatusBadge status={m.status} />
                  </td>
                  <td className="px-5 py-3 text-ink-soft">
                    {formatDate(m.startsAt)} → {formatDate(m.endsAt)}
                  </td>
                  <td className="space-x-1 px-5 py-3">
                    {m.status === "PENDING_PAYMENT" && <Button size="sm" onClick={() => memberAction(m.id, "activate")}>Activate</Button>}
                    {m.status === "ACTIVE" && <Button size="sm" variant="secondary" onClick={() => memberAction(m.id, "suspend")}>Suspend</Button>}
                    {m.status === "SUSPENDED" && <Button size="sm" variant="secondary" onClick={() => memberAction(m.id, "resume")}>Resume</Button>}
                    {(m.status === "ACTIVE" || m.status === "SUSPENDED" || m.status === "PENDING_PAYMENT") && (
                      <Button size="sm" variant="ghost" onClick={() => memberAction(m.id, "cancel")}>
                        Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {item && (
        <PriceItemDialog
          initial={item}
          services={(services.data ?? []).map((s) => ({ id: s.id, name: s.name }))}
          onClose={() => setItem(null)}
          onSaved={(saved) => {
            items.setData((prev) => {
              const l = prev ?? [];
              return l.some((x) => x.id === saved.id) ? l.map((x) => (x.id === saved.id ? saved : x)) : [...l, saved];
            });
            notify("Price saved.");
          }}
        />
      )}
      {plan && (
        <PlanDialog
          initial={plan}
          onClose={() => setPlan(null)}
          onSaved={(saved) => {
            plans.setData((prev) => (prev ?? []).map((x) => (x.id === saved.id ? saved : x)));
            notify("Plan saved. Existing members keep the benefits they purchased.");
          }}
        />
      )}
    </div>
  );
}

function PriceItemDialog({ initial, services, onClose, onSaved }: { initial: PriceItem; services: { id: string; name: string }[]; onClose: () => void; onSaved: (i: PriceItem) => void }) {
  const [i, setI] = useState(initial);
  const [pending, setPending] = useState(false);
  const set = <K extends keyof PriceItem>(k: K, v: PriceItem[K]) => setI((p) => ({ ...p, [k]: v }));
  async function save() {
    setPending(true);
    try {
      onSaved(await api.admin.savePriceItem(i));
      onClose();
    } finally {
      setPending(false);
    }
  }
  return (
    <Overlay open onClose={onClose} title={initial.name || "New price"} footer={<Button onClick={save} disabled={pending || !i.name}>{pending && <Spinner />} Save</Button>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="pi-n" className="sm:col-span-2">
          <Input id="pi-n" value={i.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Type" htmlFor="pi-k">
          <Select id="pi-k" value={i.kind} onChange={(e) => set("kind", e.target.value as PriceItem["kind"])}>
            {["SESSION", "PACKAGE", "CONSULTATION", "OFFER"].map((k) => (
              <option key={k} value={k}>
                {titleCase(k)}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Service" htmlFor="pi-s">
          <Select id="pi-s" value={i.serviceId ?? ""} onChange={(e) => set("serviceId", e.target.value || null)}>
            <option value="">General</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Price (৳)" htmlFor="pi-a">
          <Input id="pi-a" type="number" value={taka(i.amount.amount)} onChange={(e) => set("amount", bdt(Number(e.target.value)))} />
        </Field>
        <Field label="Compare-at price (৳)" htmlFor="pi-c" optional hint="Shown struck-through for promotions">
          <Input id="pi-c" type="number" value={i.compareAtAmount ? taka(i.compareAtAmount.amount) : ""} onChange={(e) => set("compareAtAmount", e.target.value ? bdt(Number(e.target.value)) : null)} />
        </Field>
        <Field label="Sessions included" htmlFor="pi-si">
          <Input id="pi-si" type="number" value={i.sessionsIncluded ?? ""} onChange={(e) => set("sessionsIncluded", e.target.value ? Number(e.target.value) : null)} />
        </Field>
        <Field label="Valid until" htmlFor="pi-vt" optional>
          <Input id="pi-vt" type="date" value={i.validTo ?? ""} onChange={(e) => set("validTo", e.target.value || null)} />
        </Field>
        <Field label="Description" htmlFor="pi-d" className="sm:col-span-2">
          <Textarea id="pi-d" rows={2} value={i.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Checkbox label="Published on website" checked={i.isPublished} onChange={(e) => set("isPublished", e.target.checked)} />
      </div>
    </Overlay>
  );
}

function PlanDialog({ initial, onClose, onSaved }: { initial: MembershipPlan; onClose: () => void; onSaved: (p: MembershipPlan) => void }) {
  const [p, setP] = useState(initial);
  const [pending, setPending] = useState(false);
  const set = <K extends keyof MembershipPlan>(k: K, v: MembershipPlan[K]) => setP((prev) => ({ ...prev, [k]: v }));
  async function save() {
    setPending(true);
    try {
      onSaved(await api.admin.savePlan({ ...p, entitlements: { ...p.entitlements, "nira.access": p.includesNira } }));
      onClose();
    } finally {
      setPending(false);
    }
  }
  return (
    <Overlay open onClose={onClose} title={`Edit ${initial.name}`} footer={<Button onClick={save} disabled={pending}>{pending && <Spinner />} Save plan</Button>}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="pl-n">
          <Input id="pl-n" value={p.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Price (৳)" htmlFor="pl-p">
          <Input id="pl-p" type="number" value={taka(p.price.amount)} onChange={(e) => set("price", bdt(Number(e.target.value)))} />
        </Field>
        <Field label="Tagline" htmlFor="pl-t" className="sm:col-span-2">
          <Input id="pl-t" value={p.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
        <Field label="Duration (days)" htmlFor="pl-d">
          <Input id="pl-d" type="number" value={p.durationDays} onChange={(e) => set("durationDays", Number(e.target.value))} />
        </Field>
        <Field label="Nira daily message limit" htmlFor="pl-q">
          <Input id="pl-q" type="number" value={Number(p.entitlements["nira.daily_messages"] ?? 0)} onChange={(e) => set("entitlements", { ...p.entitlements, "nira.daily_messages": Number(e.target.value) })} />
        </Field>
        <Field label="Benefits (one per line)" htmlFor="pl-b" className="sm:col-span-2">
          <Textarea id="pl-b" rows={4} value={p.benefits.join("\n")} onChange={(e) => set("benefits", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))} />
        </Field>
        <div className="flex flex-wrap gap-5 sm:col-span-2">
          <Checkbox label="Includes Nira access" checked={p.includesNira} onChange={(e) => set("includesNira", e.target.checked)} />
          <Checkbox label="Highlighted" checked={p.isHighlighted} onChange={(e) => set("isHighlighted", e.target.checked)} />
          <Checkbox label="Active" checked={p.isActive} onChange={(e) => set("isActive", e.target.checked)} />
        </div>
      </div>
    </Overlay>
  );
}
