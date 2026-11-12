"use client";

import { CalendarX2 } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Button, ButtonLink } from "@/components/ui/button";
import { Alert, EmptyState, Skeleton, Spinner } from "@/components/ui/feedback";
import { Field, Textarea } from "@/components/ui/form";
import { Overlay } from "@/components/ui/overlay";
import { useToast } from "@/components/ui/toast";
import { routes } from "@/config/site";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { isReschedulable } from "@/lib/appointment-status";
import { cn } from "@/lib/cn";
import { formatDayLong, formatTime, toDhakaDate } from "@/lib/datetime";
import { api } from "@/services";
import type { Appointment, AvailabilitySlot } from "@/types/appointment";
import type { ISODate } from "@/types/common";
import { AppointmentCard } from "./appointment-card";
import { SlotPicker } from "./slot-picker";

export function MyAppointments() {
  const { notify } = useToast();
  const { data, loading, error, setData } = useAsync(() => api.account.listAppointments(), []);
  const services = useAsync(() => api.catalog.listServices(), []);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [cancelling, setCancelling] = useState<Appointment | null>(null);
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);

  const now = new Date().toISOString();
  const list = (data ?? []).filter((a) => (tab === "upcoming" ? a.endsAt > now : a.endsAt <= now));
  const sorted = tab === "upcoming" ? [...list].sort((a, b) => a.startsAt.localeCompare(b.startsAt)) : list;

  const replace = (updated: Appointment) => setData((prev) => (prev ?? []).map((a) => (a.id === updated.id ? updated : a)));

  return (
    <div>
      <PageTitle title="My appointments" actions={<ButtonLink href={routes.booking}>Book appointment</ButtonLink>} />
      <div role="tablist" className="mb-5 inline-flex rounded-full border border-line bg-white p-1">
        {(["upcoming", "past"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("rounded-full px-4 py-1.5 text-sm font-medium capitalize", tab === t ? "bg-teal text-white" : "text-ink-soft")}>
            {t}
          </button>
        ))}
      </div>
      {error && <Alert tone="error">{error}</Alert>}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState icon={<CalendarX2 className="size-5" />} title={tab === "upcoming" ? "No upcoming appointments" : "No past appointments yet"} action={tab === "upcoming" ? <ButtonLink href={routes.booking} size="sm">Book now</ButtonLink> : undefined} />
      ) : (
        <div className="space-y-3">
          {sorted.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              actions={
                tab === "upcoming" && isReschedulable(a.status) ? (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => setRescheduling(a)}>
                      Reschedule
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setCancelling(a)}>
                      Cancel
                    </Button>
                  </>
                ) : undefined
              }
            />
          ))}
        </div>
      )}

      <CancelDialog
        appointment={cancelling}
        onClose={() => setCancelling(null)}
        onDone={(a) => {
          replace(a);
          notify("Appointment cancelled.");
        }}
      />
      <RescheduleDialog
        appointment={rescheduling}
        gender={rescheduling?.patient.gender ?? "MALE"}
        serviceRules={services.data?.find((s) => s.id === rescheduling?.serviceId)?.rules.cancellationCutoffMinutes}
        onClose={() => setRescheduling(null)}
        onDone={(a) => {
          replace(a);
          notify(`Moved to ${formatDayLong(toDhakaDate(a.startsAt))}, ${formatTime(a.startsAt)}.`);
        }}
      />
    </div>
  );
}

function CancelDialog({ appointment, onClose, onDone }: { appointment: Appointment | null; onClose: () => void; onDone: (a: Appointment) => void }) {
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!appointment) return null;
  async function submit() {
    setPending(true);
    setError(null);
    try {
      onDone(await api.account.cancelAppointment(appointment!.id, reason || null));
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
      title="Cancel appointment?"
      description={`${appointment.serviceName} · ${formatDayLong(toDhakaDate(appointment.startsAt))}, ${formatTime(appointment.startsAt)}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Keep appointment
          </Button>
          <Button variant="danger" onClick={submit} disabled={pending}>
            {pending && <Spinner />} Cancel appointment
          </Button>
        </>
      }
    >
      <Field label="Reason" htmlFor="cancel-reason" optional>
        <Textarea id="cancel-reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} />
      </Field>
      {error && <Alert tone="error" className="mt-4">{error}</Alert>}
    </Overlay>
  );
}

function RescheduleDialog({
  appointment,
  gender,
  serviceRules,
  onClose,
  onDone,
}: {
  appointment: Appointment | null;
  gender: "MALE" | "FEMALE";
  serviceRules: number | undefined;
  onClose: () => void;
  onDone: (a: Appointment) => void;
}) {
  const [date, setDate] = useState<ISODate | null>(null);
  const [slot, setSlot] = useState<AvailabilitySlot | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!appointment) return null;

  function close() {
    setDate(null);
    setSlot(null);
    setError(null);
    onClose();
  }
  async function submit() {
    if (!slot) return;
    setPending(true);
    setError(null);
    try {
      onDone(await api.account.rescheduleAppointment(appointment!.id, slot.startsAt));
      close();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPending(false);
    }
  }
  return (
    <Overlay
      open
      onClose={close}
      variant="drawer"
      title="Reschedule appointment"
      description={`Currently ${formatDayLong(toDhakaDate(appointment.startsAt))}, ${formatTime(appointment.startsAt)}`}
      footer={
        <Button onClick={submit} disabled={!slot || pending}>
          {pending && <Spinner />} Confirm new time
        </Button>
      }
    >
      {serviceRules !== undefined && <p className="mb-4 text-sm text-ink-soft">Changes are allowed up to {Math.round(serviceRules / 60)} hours before the appointment.</p>}
      <SlotPicker serviceId={appointment.serviceId} gender={gender} date={date} onDateChange={(d) => { setDate(d); setSlot(null); }} selected={slot} onSelect={setSlot} />
      {error && <Alert tone="error" className="mt-4">{error}</Alert>}
    </Overlay>
  );
}
