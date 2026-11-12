"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Overlay } from "@/components/ui/overlay";
import { AppointmentStatusBadge } from "@/components/ui/status-badge";
import { routes } from "@/config/site";
import { errorMessage } from "@/hooks/use-async";
import { REQUIRES_REASON, TRANSITION_LABEL, TRANSITIONS, isReschedulable } from "@/lib/appointment-status";
import { dhakaDateTimeToUtc, dhakaMinutesOfDay, formatDayLong, formatTimeRange, minutesToTime, parseTime, toDhakaDate } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import { titleCase } from "@/lib/strings";
import { api } from "@/services";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import type { Practitioner } from "@/types/practitioner";

interface Props {
  appointment: Appointment | null;
  practitioners: Practitioner[];
  onClose: () => void;
  onChanged: (a: Appointment, message: string) => void;
}

export function AppointmentDrawer({ appointment, practitioners, onClose, onChanged }: Props) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reasonFor, setReasonFor] = useState<AppointmentStatus | null>(null);
  const [reason, setReason] = useState("");
  if (!appointment) return null;
  const a = appointment;
  const nameOf = (id: string | null) => practitioners.find((p) => p.id === id)?.displayName ?? "—";
  const offering = practitioners.filter((p) => p.serviceIds.includes(a.serviceId));

  async function run(label: string, fn: () => Promise<Appointment>, message: string) {
    setPending(label);
    setError(null);
    try {
      onChanged(await fn(), message);
      setReasonFor(null);
      setReason("");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPending(null);
    }
  }

  function transition(to: AppointmentStatus) {
    if (REQUIRES_REASON.includes(to) && reasonFor !== to) {
      setReasonFor(to);
      return;
    }
    if (REQUIRES_REASON.includes(to) && !reason.trim()) {
      setError("Please enter a reason.");
      return;
    }
    void run(to, () => api.admin.updateStatus(a.id, to, reason.trim() || null), `Marked ${TRANSITION_LABEL[to]?.toLowerCase() ?? to}.`);
  }

  return (
    <Overlay open variant="drawer" onClose={onClose} title={a.patient.fullName} description={`${a.serviceName} · Ref ${a.reference}`}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <AppointmentStatusBadge status={a.status} />
          <Badge tone="outline">{titleCase(a.source)}</Badge>
          <Badge tone={a.charge.paymentStatus === "PAID" ? "mint" : "sand"}>{titleCase(a.charge.paymentStatus)}</Badge>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-mist/60 p-4 text-sm">
          <Item label="Date">{formatDayLong(toDhakaDate(a.startsAt))}</Item>
          <Item label="Time">{formatTimeRange(a.startsAt, a.endsAt)}</Item>
          <Item label="Assigned">{nameOf(a.assignedPractitionerId)}</Item>
          <Item label="Treated by">{a.treatingPractitionerId ? nameOf(a.treatingPractitionerId) : <span className="text-ink-soft">Set on completion</span>}</Item>
          <Item label="Patient">
            {a.patient.gender === "FEMALE" ? "Female" : "Male"} · {a.patient.ageYears ?? "—"} yrs
          </Item>
          <Item label="Phone">
            <a href={`tel:${a.patient.phone}`} className="text-teal">
              {a.patient.phone}
            </a>
          </Item>
          <Item label="Fee">
            {formatMoney(a.charge.net, "—")}
            {a.charge.discount && <span className="block text-xs text-ink-soft">Discount {formatMoney(a.charge.discount)}</span>}
          </Item>
          <Item label="Record">
            <Link href={routes.admin.patient(a.patient.id)} className="inline-flex items-center gap-1 text-teal">
              {a.patient.medicalRecordNo} <ExternalLink className="size-3" />
            </Link>
          </Item>
          {a.reasonForVisit && (
            <div className="col-span-2">
              <dt className="text-xs text-ink-soft">Reason for visit (staff only)</dt>
              <dd className="text-ink">{a.reasonForVisit}</dd>
            </div>
          )}
        </dl>

        {TRANSITIONS[a.status].length > 0 && (
          <section>
            <h3 className="mb-2 font-sans text-sm font-semibold tracking-normal text-ink">Update status</h3>
            <div className="flex flex-wrap gap-2">
              {TRANSITIONS[a.status].map((to) => (
                <Button key={to} size="sm" variant={to === "CANCELLED" || to === "REJECTED" || to === "NO_SHOW" ? "secondary" : "primary"} disabled={!!pending} onClick={() => transition(to)}>
                  {pending === to && <Spinner />} {TRANSITION_LABEL[to]}
                </Button>
              ))}
            </div>
            {reasonFor && (
              <div className="mt-3 space-y-2">
                <Field label={`Reason (${TRANSITION_LABEL[reasonFor]?.toLowerCase()})`} htmlFor="status-reason">
                  <Textarea id="status-reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
                </Field>
                <Button size="sm" variant="danger" disabled={!!pending} onClick={() => transition(reasonFor)}>
                  Confirm {TRANSITION_LABEL[reasonFor]?.toLowerCase()}
                </Button>
              </div>
            )}
          </section>
        )}

        {(a.status === "CONFIRMED" || a.status === "IN_PROGRESS" || a.status === "COMPLETED") && (
          <section>
            <h3 className="mb-1 font-sans text-sm font-semibold tracking-normal text-ink">Treating practitioner</h3>
            <p className="mb-2 text-xs text-ink-soft">Commission is calculated for the practitioner who actually treated the patient.</p>
            <Select
              aria-label="Treating practitioner"
              value={a.treatingPractitionerId ?? a.assignedPractitionerId}
              disabled={!!pending}
              onChange={(e) => run("treating", () => api.admin.setTreatingPractitioner(a.id, e.target.value), "Treating practitioner updated.")}
            >
              {offering.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName} ({p.gender === "FEMALE" ? "F" : "M"})
                </option>
              ))}
            </Select>
          </section>
        )}

        {isReschedulable(a.status) && <RescheduleForm appointment={a} practitioners={offering} pending={pending} onSubmit={(startsAt, practitionerId) => run("move", () => api.admin.reschedule(a.id, { startsAt, practitionerId }), "Appointment moved.")} />}

        {error && <Alert tone="error">{error}</Alert>}
      </div>
    </Overlay>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className="font-medium text-ink">{children}</dd>
    </div>
  );
}

function RescheduleForm({ appointment: a, practitioners, pending, onSubmit }: { appointment: Appointment; practitioners: Practitioner[]; pending: string | null; onSubmit: (startsAt: string, practitionerId: string) => void }) {
  const [date, setDate] = useState(toDhakaDate(a.startsAt));
  const [time, setTime] = useState(minutesToTime(dhakaMinutesOfDay(a.startsAt)));
  const [pid, setPid] = useState(a.assignedPractitionerId);
  return (
    <section className="rounded-xl border border-line p-4">
      <h3 className="mb-3 font-sans text-sm font-semibold tracking-normal text-ink">Reschedule / reassign</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Date" htmlFor="rs-date">
          <Input id="rs-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Start time" htmlFor="rs-time">
          <Input id="rs-time" type="time" step={900} value={time} onChange={(e) => setTime(e.target.value)} />
        </Field>
        <Field label="Practitioner" htmlFor="rs-p" className="sm:col-span-2">
          <Select id="rs-p" value={pid} onChange={(e) => setPid(e.target.value)}>
            {practitioners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName} ({p.gender === "FEMALE" ? "F" : "M"})
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Button size="sm" className="mt-3" disabled={!!pending || !date || !time} onClick={() => onSubmit(dhakaDateTimeToUtc(date, parseTime(time)).toISOString(), pid)}>
        {pending === "move" && <Spinner />} Move appointment
      </Button>
      <p className="mt-2 text-xs text-ink-soft">The server re-checks availability, gender policy and overlaps before moving.</p>
    </section>
  );
}
