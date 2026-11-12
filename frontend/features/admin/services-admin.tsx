"use client";

import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton, Spinner } from "@/components/ui/feedback";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Overlay } from "@/components/ui/overlay";
import { useToast } from "@/components/ui/toast";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { formatMoney } from "@/lib/money";
import { api } from "@/services";
import type { Service } from "@/types/catalog";
import { ServiceIcon } from "@/features/service-catalog/service-icon";

const POLICY = { REQUIRED_SAME_GENDER: "Same gender required", PREFERRED: "Same gender preferred", NONE: "Any practitioner" } as const;

export function ServicesAdmin() {
  const { notify } = useToast();
  const list = useAsync(() => api.admin.listServices(), []);
  const [editing, setEditing] = useState<Service | null>(null);

  return (
    <div className="space-y-5">
      <PageTitle title="Services" description="Service catalogue, durations and booking rules. Prices are managed under Pricing." />
      {list.loading && !list.data ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[56rem] text-sm">
            <thead className="bg-mist/60 text-left text-xs tracking-wide text-ink-soft uppercase">
              <tr>
                {["Service", "Type", "Duration", "Gender policy", "Booking", "From", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(list.data ?? []).map((s) => (
                <tr key={s.id} onClick={() => setEditing(s)} className="cursor-pointer hover:bg-mist/40">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2.5 font-semibold text-ink">
                      <ServiceIcon icon={s.icon} className="size-4 text-sage" /> {s.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{s.kind === "PHYSIOTHERAPY" ? "Physiotherapy" : "Consultancy"}</td>
                  <td className="px-4 py-3">{s.rules.durationMinutes} min</td>
                  <td className="px-4 py-3">{POLICY[s.rules.genderPolicy]}</td>
                  <td className="px-4 py-3">{s.rules.bookingMode === "AUTO_CONFIRM" ? "Auto-confirm" : "Needs approval"}</td>
                  <td className="px-4 py-3">{formatMoney(s.startingPrice, "—")}</td>
                  <td className="px-4 py-3">
                    <Badge tone={s.isActive ? "mint" : "slate"}>{s.isActive ? "Active" : "Disabled"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <ServiceEditor
          key={editing.id}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={(s) => {
            list.setData((prev) => (prev ?? []).map((x) => (x.id === s.id ? s : x)));
            notify(`${s.name} saved.`);
          }}
        />
      )}
    </div>
  );
}

function ServiceEditor({ initial, onClose, onSaved }: { initial: Service; onClose: () => void; onSaved: (s: Service) => void }) {
  const [s, setS] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof Service>(k: K, v: Service[K]) => setS((p) => ({ ...p, [k]: v }));
  const rule = <K extends keyof Service["rules"]>(k: K, v: Service["rules"][K]) => setS((p) => ({ ...p, rules: { ...p.rules, [k]: v } }));
  const lines = (v: string) => v.split("\n").map((x) => x.trim()).filter(Boolean);

  async function save() {
    setPending(true);
    setError(null);
    try {
      onSaved(await api.admin.saveService(s));
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
      variant="drawer"
      onClose={onClose}
      title={initial.name}
      className="sm:max-w-2xl"
      footer={
        <>
          {error && <span className="mr-auto self-center text-sm text-rose">{error}</span>}
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={pending}>
            {pending && <Spinner />} Save service
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="sv-n" className="sm:col-span-2">
          <Input id="sv-n" value={s.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Summary" htmlFor="sv-s" className="sm:col-span-2">
          <Input id="sv-s" value={s.summary} onChange={(e) => set("summary", e.target.value)} />
        </Field>
        <Field label="Description" htmlFor="sv-d" className="sm:col-span-2">
          <Textarea id="sv-d" rows={4} value={s.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
        <Field label="Who may benefit (one per line)" htmlFor="sv-b">
          <Textarea id="sv-b" rows={4} value={s.benefitsFor.join("\n")} onChange={(e) => set("benefitsFor", lines(e.target.value))} />
        </Field>
        <Field label="What to expect (one per line)" htmlFor="sv-w">
          <Textarea id="sv-w" rows={4} value={s.whatToExpect.join("\n")} onChange={(e) => set("whatToExpect", lines(e.target.value))} />
        </Field>
        <Field label="Availability note (public)" htmlFor="sv-an" optional className="sm:col-span-2">
          <Input id="sv-an" value={s.availabilityNote ?? ""} onChange={(e) => set("availabilityNote", e.target.value || null)} />
        </Field>

        <p className="pt-2 text-sm font-semibold text-ink sm:col-span-2">Booking rules</p>
        <Field label="Session duration (min)" htmlFor="sv-dur">
          <Input id="sv-dur" type="number" step={5} value={s.rules.durationMinutes} onChange={(e) => rule("durationMinutes", Number(e.target.value))} />
        </Field>
        <Field label="Buffer after session (min)" htmlFor="sv-buf">
          <Input id="sv-buf" type="number" step={5} value={s.rules.bufferMinutes} onChange={(e) => rule("bufferMinutes", Number(e.target.value))} />
        </Field>
        <Field label="Gender policy" htmlFor="sv-gp">
          <Select id="sv-gp" value={s.rules.genderPolicy} onChange={(e) => rule("genderPolicy", e.target.value as Service["rules"]["genderPolicy"])}>
            {Object.entries(POLICY).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Confirmation" htmlFor="sv-bm">
          <Select id="sv-bm" value={s.rules.bookingMode} onChange={(e) => rule("bookingMode", e.target.value as Service["rules"]["bookingMode"])}>
            <option value="AUTO_CONFIRM">Auto-confirm</option>
            <option value="REQUIRES_APPROVAL">Requires reception approval</option>
          </Select>
        </Field>
        <Field label="Minimum notice (hours)" htmlFor="sv-lead">
          <Input id="sv-lead" type="number" value={s.rules.minLeadMinutes / 60} onChange={(e) => rule("minLeadMinutes", Number(e.target.value) * 60)} />
        </Field>
        <Field label="Bookable up to (days ahead)" htmlFor="sv-max">
          <Input id="sv-max" type="number" value={s.rules.maxDaysAhead} onChange={(e) => rule("maxDaysAhead", Number(e.target.value))} />
        </Field>
        <Field label="Free cancellation until (hours before)" htmlFor="sv-cc">
          <Input id="sv-cc" type="number" value={s.rules.cancellationCutoffMinutes / 60} onChange={(e) => rule("cancellationCutoffMinutes", Number(e.target.value) * 60)} />
        </Field>
        <Field label="Eligible patients" htmlFor="sv-el">
          <Select id="sv-el" value={s.rules.eligibleGenders.join(",")} onChange={(e) => rule("eligibleGenders", e.target.value ? (e.target.value.split(",") as Service["rules"]["eligibleGenders"]) : [])}>
            <option value="">All patients</option>
            <option value="FEMALE">Female patients only</option>
            <option value="MALE">Male patients only</option>
          </Select>
        </Field>
        <div className="flex flex-wrap gap-5 sm:col-span-2">
          <Checkbox label="Active (bookable)" checked={s.isActive} onChange={(e) => set("isActive", e.target.checked)} />
          <Checkbox label="Featured on homepage" checked={s.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
        </div>
      </div>
    </Overlay>
  );
}
