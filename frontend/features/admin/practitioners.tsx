"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, Skeleton, Spinner } from "@/components/ui/feedback";
import { Checkbox, Field, Input, Select, Textarea } from "@/components/ui/form";
import { Monogram } from "@/components/ui/monogram";
import { Overlay } from "@/components/ui/overlay";
import { useToast } from "@/components/ui/toast";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/cn";
import { dhakaToday, formatClock, formatDate, WEEKDAY_NAMES } from "@/lib/datetime";
import { api } from "@/services";
import type { Service } from "@/types/catalog";
import type { AvailabilityRule, CommissionRule, Practitioner } from "@/types/practitioner";

export function describeRule(r: AvailabilityRule): string {
  const hours = `${formatClock(r.start)} – ${formatClock(r.end)}`;
  const breaks = r.breaks.length ? ` (break ${r.breaks.map((b) => `${formatClock(b.start)}–${formatClock(b.end)}`).join(", ")})` : "";
  switch (r.kind) {
    case "WEEKLY":
      return `Every ${r.weekdays.map((d) => WEEKDAY_NAMES[d]!.slice(0, 3)).join(", ")} · ${hours}${breaks}`;
    case "EVERY_N_WEEKS":
      return `Every ${r.intervalWeeks} weeks on ${WEEKDAY_NAMES[r.weekday]} from ${formatDate(r.anchorDate)} · ${hours}`;
    case "MONTHLY_NTH_WEEKDAY":
      return `${r.nth.map((n) => ["1st", "2nd", "3rd", "4th", "5th"][n - 1]).join(" & ")} ${WEEKDAY_NAMES[r.weekday]} of each month · ${hours}`;
    case "SPECIFIC_DATE":
      return `${formatDate(r.date)} only · ${hours}`;
  }
}

export function PractitionersAdmin() {
  const { notify } = useToast();
  const list = useAsync(() => api.admin.listPractitioners(), []);
  const services = useAsync(() => api.admin.listServices(), []);
  const [editing, setEditing] = useState<Practitioner | null>(null);

  function blank(): Practitioner {
    return {
      id: `prc_new_${Date.now()}`, slug: "", displayName: "", isPlaceholder: false, gender: "FEMALE", designation: "Physiotherapist", qualifications: [], specialization: "", experienceYears: null, bio: "",
      photo: null, serviceIds: [], availabilitySummary: "", isVisiting: false, isActive: true, isPublic: true, sessionMinutes: 45, rules: [], color: "#6B9799",
    };
  }

  return (
    <div className="space-y-5">
      <PageTitle title="Practitioners" description="Profiles, services, schedules and commission configuration." actions={<Button onClick={() => setEditing(blank())}><Plus className="size-4" /> Add practitioner</Button>} />
      {list.loading && !list.data ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(list.data ?? []).map((p) => (
            <button key={p.id} onClick={() => setEditing(p)} className="rounded-2xl border border-line bg-white p-5 text-left transition-colors hover:border-sage/60">
              <div className="flex items-center gap-3">
                <Monogram name={p.displayName} color={p.color} className="size-11 text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{p.displayName}</p>
                  <p className="truncate text-xs text-ink-soft">{p.designation}</p>
                </div>
                <Badge tone={p.isActive ? "mint" : "slate"}>{p.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge tone={p.gender === "FEMALE" ? "sand" : "teal"}>{p.gender === "FEMALE" ? "Female" : "Male"}</Badge>
                {p.isVisiting && <Badge tone="outline">Visiting</Badge>}
                {p.isPlaceholder && <Badge tone="sand">Placeholder profile</Badge>}
                <Badge tone="outline">{p.serviceIds.length} services</Badge>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-ink-soft">
                {p.rules.map((r) => (
                  <li key={r.id}>{describeRule(r)}</li>
                ))}
                {p.rules.length === 0 && <li>No schedule configured</li>}
              </ul>
            </button>
          ))}
        </div>
      )}
      {editing && (
        <PractitionerEditor
          key={editing.id}
          initial={editing}
          services={services.data ?? []}
          onClose={() => setEditing(null)}
          onSaved={(p) => {
            list.setData((prev) => {
              const l = prev ?? [];
              return l.some((x) => x.id === p.id) ? l.map((x) => (x.id === p.id ? p : x)) : [...l, p];
            });
            notify(`${p.displayName} saved.`);
          }}
        />
      )}
    </div>
  );
}

type Tab = "profile" | "services" | "schedule" | "commission";

function PractitionerEditor({ initial, services, onClose, onSaved }: { initial: Practitioner; services: Service[]; onClose: () => void; onSaved: (p: Practitioner) => void }) {
  const [p, setP] = useState<Practitioner>(initial);
  const [tab, setTab] = useState<Tab>("profile");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = <K extends keyof Practitioner>(k: K, v: Practitioner[K]) => setP((prev) => ({ ...prev, [k]: v }));

  async function save() {
    if (!p.displayName.trim()) return setError("Name is required.");
    setPending(true);
    setError(null);
    try {
      onSaved(await api.admin.savePractitioner({ ...p, slug: p.slug || p.displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-"), isPlaceholder: false }));
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
      title={initial.displayName || "New practitioner"}
      className="sm:max-w-2xl"
      footer={
        <>
          {error && <span className="mr-auto self-center text-sm text-rose">{error}</span>}
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={pending}>
            {pending && <Spinner />} Save practitioner
          </Button>
        </>
      }
    >
      <div role="tablist" className="mb-5 flex gap-1 overflow-x-auto border-b border-line">
        {(["profile", "services", "schedule", "commission"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("-mb-px border-b-2 px-3 py-2 text-sm font-medium capitalize", tab === t ? "border-teal text-teal" : "border-transparent text-ink-soft")}>
            {t}
          </button>
        ))}
      </div>

      {tab === "profile" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Display name" htmlFor="pr-name" className="sm:col-span-2">
            <Input id="pr-name" value={p.displayName} onChange={(e) => set("displayName", e.target.value)} />
          </Field>
          <Field label="Gender" htmlFor="pr-g" hint="Used for same-gender matching">
            <Select id="pr-g" value={p.gender} onChange={(e) => set("gender", e.target.value as Practitioner["gender"])}>
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
            </Select>
          </Field>
          <Field label="Designation" htmlFor="pr-d">
            <Input id="pr-d" value={p.designation} onChange={(e) => set("designation", e.target.value)} />
          </Field>
          <Field label="Specialisation" htmlFor="pr-s" className="sm:col-span-2">
            <Input id="pr-s" value={p.specialization} onChange={(e) => set("specialization", e.target.value)} />
          </Field>
          <Field label="Qualifications" htmlFor="pr-q" hint="Comma separated, as verified by the clinic" className="sm:col-span-2">
            <Input id="pr-q" value={p.qualifications.join(", ")} onChange={(e) => set("qualifications", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
          </Field>
          <Field label="Experience (years)" htmlFor="pr-x" optional>
            <Input id="pr-x" type="number" value={p.experienceYears ?? ""} onChange={(e) => set("experienceYears", e.target.value === "" ? null : Number(e.target.value))} />
          </Field>
          <Field label="Default session (min)" htmlFor="pr-m">
            <Input id="pr-m" type="number" step={5} value={p.sessionMinutes} onChange={(e) => set("sessionMinutes", Number(e.target.value))} />
          </Field>
          <Field label="Public availability summary" htmlFor="pr-as" className="sm:col-span-2">
            <Input id="pr-as" value={p.availabilitySummary} onChange={(e) => set("availabilitySummary", e.target.value)} />
          </Field>
          <Field label="Biography" htmlFor="pr-b" className="sm:col-span-2">
            <Textarea id="pr-b" rows={3} value={p.bio} onChange={(e) => set("bio", e.target.value)} />
          </Field>
          <div className="flex flex-wrap gap-5 sm:col-span-2">
            <Checkbox label="Active" checked={p.isActive} onChange={(e) => set("isActive", e.target.checked)} />
            <Checkbox label="Shown on website" checked={p.isPublic} onChange={(e) => set("isPublic", e.target.checked)} />
            <Checkbox label="Visiting specialist" checked={p.isVisiting} onChange={(e) => set("isVisiting", e.target.checked)} />
          </div>
          <p className="text-xs text-ink-soft sm:col-span-2">Photo upload requires the backend media service (pending).</p>
        </div>
      )}

      {tab === "services" && (
        <div className="space-y-2">
          {services.map((s) => (
            <Checkbox
              key={s.id}
              className="flex rounded-xl border border-line px-3 py-2.5"
              label={
                <span>
                  {s.name} <span className="text-xs text-ink-soft">· {s.kind === "PHYSIOTHERAPY" ? "Physio" : "Consultancy"}</span>
                </span>
              }
              checked={p.serviceIds.includes(s.id)}
              onChange={(e) => set("serviceIds", e.target.checked ? [...p.serviceIds, s.id] : p.serviceIds.filter((x) => x !== s.id))}
            />
          ))}
        </div>
      )}

      {tab === "schedule" && <ScheduleEditor rules={p.rules} onChange={(rules) => set("rules", rules)} />}
      {tab === "commission" && <CommissionPanel practitioner={p} services={services} />}
    </Overlay>
  );
}

function ScheduleEditor({ rules, onChange }: { rules: AvailabilityRule[]; onChange: (r: AvailabilityRule[]) => void }) {
  const [kind, setKind] = useState<AvailabilityRule["kind"]>("WEEKLY");
  const [weekdays, setWeekdays] = useState<number[]>([6, 0, 1, 2, 3, 4]);
  const [weekday, setWeekday] = useState(5);
  const [intervalWeeks, setIntervalWeeks] = useState(2);
  const [anchor, setAnchor] = useState(dhakaToday());
  const [nth, setNth] = useState<number[]>([1, 3]);
  const [date, setDate] = useState(dhakaToday());
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [breakStart, setBreakStart] = useState("");
  const [breakEnd, setBreakEnd] = useState("");

  function add() {
    const base = { id: `r_${Date.now()}`, start, end, breaks: breakStart && breakEnd ? [{ start: breakStart, end: breakEnd }] : [], effectiveFrom: dhakaToday(), effectiveTo: null };
    const rule: AvailabilityRule =
      kind === "WEEKLY"
        ? { ...base, kind, weekdays }
        : kind === "EVERY_N_WEEKS"
          ? { ...base, kind, weekday, intervalWeeks, anchorDate: anchor }
          : kind === "MONTHLY_NTH_WEEKDAY"
            ? { ...base, kind, weekday, nth }
            : { ...base, kind, date };
    onChange([...rules, rule]);
  }

  const toggle = (list: number[], v: number) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v].sort());

  return (
    <div className="space-y-5">
      <ul className="space-y-2">
        {rules.length === 0 && <li className="text-sm text-ink-soft">No availability rules — this practitioner won&apos;t appear in booking.</li>}
        {rules.map((r) => (
          <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-line px-3 py-2.5 text-sm">
            <span>{describeRule(r)}</span>
            <button aria-label="Remove rule" onClick={() => onChange(rules.filter((x) => x.id !== r.id))} className="text-ink-soft hover:text-rose">
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>
      <div className="space-y-4 rounded-xl bg-mist/60 p-4">
        <p className="text-sm font-semibold text-ink">Add availability</p>
        <Select aria-label="Pattern" value={kind} onChange={(e) => setKind(e.target.value as AvailabilityRule["kind"])}>
          <option value="WEEKLY">Weekly (selected weekdays)</option>
          <option value="EVERY_N_WEEKS">Every N weeks (e.g. alternate Fridays)</option>
          <option value="MONTHLY_NTH_WEEKDAY">Nth weekday of month (e.g. 1st & 3rd Tuesday)</option>
          <option value="SPECIFIC_DATE">Specific date (one-off visit)</option>
        </Select>
        {kind === "WEEKLY" && (
          <div className="flex flex-wrap gap-1.5">
            {[6, 0, 1, 2, 3, 4, 5].map((d) => (
              <button key={d} type="button" onClick={() => setWeekdays(toggle(weekdays, d))} className={cn("rounded-full border px-3 py-1 text-sm", weekdays.includes(d) ? "border-teal bg-teal text-white" : "border-line bg-white")}>
                {WEEKDAY_NAMES[d]!.slice(0, 3)}
              </button>
            ))}
          </div>
        )}
        {(kind === "EVERY_N_WEEKS" || kind === "MONTHLY_NTH_WEEKDAY") && (
          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Weekday" htmlFor="sr-wd">
              <Select id="sr-wd" value={weekday} onChange={(e) => setWeekday(Number(e.target.value))}>
                {WEEKDAY_NAMES.map((n, i) => (
                  <option key={n} value={i}>
                    {n}
                  </option>
                ))}
              </Select>
            </Field>
            {kind === "EVERY_N_WEEKS" ? (
              <>
                <Field label="Every N weeks" htmlFor="sr-n">
                  <Input id="sr-n" type="number" min={1} value={intervalWeeks} onChange={(e) => setIntervalWeeks(Math.max(1, Number(e.target.value)))} />
                </Field>
                <Field label="First visit date" htmlFor="sr-a">
                  <Input id="sr-a" type="date" value={anchor} onChange={(e) => setAnchor(e.target.value)} />
                </Field>
              </>
            ) : (
              <div className="sm:col-span-2">
                <p className="mb-1.5 text-sm font-semibold text-ink">Occurrences</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setNth(toggle(nth, n))} className={cn("rounded-full border px-3 py-1 text-sm", nth.includes(n) ? "border-teal bg-teal text-white" : "border-line bg-white")}>
                      {["1st", "2nd", "3rd", "4th", "5th"][n - 1]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {kind === "SPECIFIC_DATE" && (
          <Field label="Date" htmlFor="sr-date">
            <Input id="sr-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="From" htmlFor="sr-s">
            <Input id="sr-s" type="time" step={900} value={start} onChange={(e) => setStart(e.target.value)} />
          </Field>
          <Field label="To" htmlFor="sr-e">
            <Input id="sr-e" type="time" step={900} value={end} onChange={(e) => setEnd(e.target.value)} />
          </Field>
          <Field label="Break from" htmlFor="sr-bs" optional>
            <Input id="sr-bs" type="time" step={900} value={breakStart} onChange={(e) => setBreakStart(e.target.value)} />
          </Field>
          <Field label="Break to" htmlFor="sr-be" optional>
            <Input id="sr-be" type="time" step={900} value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)} />
          </Field>
        </div>
        <Button size="sm" variant="secondary" onClick={add} disabled={end <= start}>
          <Plus className="size-4" /> Add rule
        </Button>
      </div>
      <p className="text-xs text-ink-soft">The backend stores rules with effective dates; editing closes the old rule rather than changing past availability. Leave and holidays are added as exceptions (backend).</p>
    </div>
  );
}

function CommissionPanel({ practitioner, services }: { practitioner: Practitioner; services: Service[] }) {
  const { notify } = useToast();
  const rules = useAsync(() => api.admin.listCommissionRules(), []);
  const [type, setType] = useState<CommissionRule["type"]>("PERCENTAGE");
  const [value, setValue] = useState("30");
  const [serviceId, setServiceId] = useState("");
  const [from, setFrom] = useState(dhakaToday());
  const [pending, setPending] = useState(false);
  const mine = (rules.data ?? []).filter((r) => r.practitionerId === practitioner.id);
  const fallback = (rules.data ?? []).filter((r) => r.practitionerId === null);

  async function add() {
    setPending(true);
    try {
      const rule: CommissionRule = {
        id: `cr_${Date.now()}`,
        practitionerId: practitioner.id,
        serviceId: serviceId || null,
        type,
        rateBps: type === "PERCENTAGE" ? Math.round(Number(value) * 100) : null,
        fixedAmount: type === "FIXED" ? Math.round(Number(value) * 100) : null,
        base: "NET_AFTER_DISCOUNT",
        effectiveFrom: from,
        effectiveTo: null,
      };
      await api.admin.saveCommissionRule(rule);
      rules.reload();
      notify("Commission rule added. Past commissions are unaffected.");
    } catch (e) {
      notify(errorMessage(e), "error");
    } finally {
      setPending(false);
    }
  }

  const label = (r: CommissionRule) =>
    `${r.type === "PERCENTAGE" ? `${(r.rateBps ?? 0) / 100}%` : `৳${(r.fixedAmount ?? 0) / 100} per session`}${r.serviceId ? ` · ${services.find((s) => s.id === r.serviceId)?.name ?? "service"}` : " · all services"}`;

  return (
    <div className="space-y-5">
      <Alert tone="info">Rules are effective-dated. A new rule only affects sessions completed on or after its start date; historical commissions keep their original snapshot.</Alert>
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Practitioner-specific rules</p>
        <ul className="space-y-2 text-sm">
          {mine.length === 0 && <li className="text-ink-soft">None — clinic/service defaults apply.</li>}
          {mine.map((r) => (
            <li key={r.id} className="flex justify-between rounded-xl border border-line px-3 py-2">
              <span>{label(r)}</span>
              <span className="text-xs text-ink-soft">
                {formatDate(r.effectiveFrom)} → {r.effectiveTo ? formatDate(r.effectiveTo) : "open"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-soft">Fallbacks: {fallback.map(label).join(" · ") || "none"}</p>
      </div>
      <div className="grid gap-3 rounded-xl bg-mist/60 p-4 sm:grid-cols-2">
        <Field label="Type" htmlFor="cm-t">
          <Select id="cm-t" value={type} onChange={(e) => setType(e.target.value as CommissionRule["type"])}>
            <option value="PERCENTAGE">Percentage of fee</option>
            <option value="FIXED">Fixed per completed session</option>
          </Select>
        </Field>
        <Field label={type === "PERCENTAGE" ? "Rate (%)" : "Amount (৳)"} htmlFor="cm-v">
          <Input id="cm-v" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
        </Field>
        <Field label="Service" htmlFor="cm-s">
          <Select id="cm-s" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
            <option value="">All services</option>
            {services.filter((s) => practitioner.serviceIds.includes(s.id)).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Effective from" htmlFor="cm-f">
          <Input id="cm-f" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Button size="sm" onClick={add} disabled={pending || !value} className="sm:col-span-2 sm:justify-self-start">
          {pending && <Spinner />} Add commission rule
        </Button>
      </div>
    </div>
  );
}
