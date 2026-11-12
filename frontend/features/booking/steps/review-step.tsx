"use client";

import { CalendarDays, Clock, Info, Stethoscope, UserRound, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { formatDayLong, formatTimeRange, toDhakaDate } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import type { AvailabilitySlot } from "@/types/appointment";
import type { Service } from "@/types/catalog";
import type { Gender } from "@/types/common";
import type { PatientDetails } from "@/features/auth/schemas";
import type { Step } from "../booking-state";
import { StepHeader } from "../step-header";

interface Props {
  service: Service;
  gender: Gender;
  patient: PatientDetails;
  slot: AvailabilitySlot;
  submitting: boolean;
  error: string | null;
  onEdit: (step: Step) => void;
  onConfirm: () => void;
}

function Row({ icon, label, children, onEdit }: { icon: ReactNode; label: string; children: ReactNode; onEdit?: () => void }) {
  return (
    <div className="flex items-start gap-4 px-5 py-4">
      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-mist text-teal">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{label}</p>
        <div className="mt-0.5 text-ink">{children}</div>
      </div>
      {onEdit && (
        <button type="button" onClick={onEdit} className="text-sm font-semibold text-teal hover:text-teal-deep">
          Edit
        </button>
      )}
    </div>
  );
}

export function ReviewStep({ service, gender, patient, slot, submitting, error, onEdit, onConfirm }: Props) {
  const { rules } = service;
  const practitionerLine =
    rules.genderPolicy === "REQUIRED_SAME_GENDER"
      ? `A ${gender === "FEMALE" ? "female" : "male"} practitioner will be assigned automatically`
      : "The specialist on duty will be assigned automatically";
  const cutoffHours = Math.round(rules.cancellationCutoffMinutes / 60);

  return (
    <div>
      <StepHeader step={6} title="Review and confirm" description="Please check the details below before confirming." />
      <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        <Row icon={<Stethoscope className="size-4" />} label="Service" onEdit={() => onEdit("service")}>
          <span className="font-semibold">{service.name}</span> <span className="text-ink-soft">· {rules.durationMinutes} min</span>
        </Row>
        <Row icon={<UserRound className="size-4" />} label="Patient" onEdit={() => onEdit("patient")}>
          <span className="font-semibold">{patient.fullName}</span>
          <span className="block text-sm text-ink-soft">
            {gender === "FEMALE" ? "Female" : "Male"} · {patient.ageYears} yrs · {patient.phone}
            {patient.email ? ` · ${patient.email}` : ""}
          </span>
          {patient.reasonForVisit && <span className="mt-1 block text-sm text-ink-soft">“{patient.reasonForVisit}”</span>}
        </Row>
        <Row icon={<CalendarDays className="size-4" />} label="Date & time" onEdit={() => onEdit("time")}>
          <span className="font-semibold">{formatDayLong(toDhakaDate(slot.startsAt))}</span>
          <span className="block text-sm text-ink-soft">{formatTimeRange(slot.startsAt, slot.endsAt)}</span>
        </Row>
        <Row icon={<Clock className="size-4" />} label="Practitioner">
          {practitionerLine}
        </Row>
        <Row icon={<Wallet className="size-4" />} label="Fee">
          <span className="font-semibold">{formatMoney(service.startingPrice, "Confirmed at the clinic")}</span>
          <span className="block text-sm text-ink-soft">Pay at the clinic. Member discounts are applied at checkout.</span>
        </Row>
      </div>

      <div className="mt-5 space-y-2 rounded-xl bg-mist px-4 py-3.5 text-sm text-ink-soft">
        <p className="flex gap-2">
          <Info className="mt-0.5 size-4 shrink-0 text-sage" />
          {rules.bookingMode === "AUTO_CONFIRM"
            ? "Your appointment is confirmed as soon as you book."
            : "This is a booking request. The clinic will confirm it with you before the visit."}
        </p>
        <p className="pl-6">Free cancellation or rescheduling up to {cutoffHours} hours before your appointment. Please arrive 10 minutes early.</p>
      </div>

      {error && (
        <Alert tone="error" className="mt-5">
          {error}
        </Alert>
      )}

      <Button size="lg" className="mt-6 w-full sm:w-auto" onClick={onConfirm} disabled={submitting}>
        {submitting && <Spinner />} {rules.bookingMode === "AUTO_CONFIRM" ? "Confirm appointment" : "Send booking request"}
      </Button>
    </div>
  );
}
