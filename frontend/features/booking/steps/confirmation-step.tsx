"use client";

import { CalendarPlus, CheckCircle2, Clock3, Mail, MessageCircle, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { formatDayLong, formatTimeRange, toDhakaDate } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import type { AppointmentConfirmation } from "@/types/appointment";
import { buildIcs, downloadIcs } from "../ics";

const CHANNEL = {
  SMS: { label: "SMS", Icon: Smartphone },
  EMAIL: { label: "Email", Icon: Mail },
  WHATSAPP: { label: "WhatsApp", Icon: MessageCircle },
} as const;

const DELIVERY = {
  SENT: { label: "Sent", tone: "mint" },
  QUEUED: { label: "On its way", tone: "sky" },
  FAILED: { label: "Failed", tone: "rose" },
  NOT_CONFIGURED: { label: "Not connected yet", tone: "slate" },
} as const;

interface Props {
  confirmation: AppointmentConfirmation;
  clinicAddress: string;
  isSignedIn: boolean;
  onBookAnother: () => void;
}

export function ConfirmationStep({ confirmation: c, clinicAddress, isSignedIn, onBookAnother }: Props) {
  const isPending = c.status === "PENDING";
  const anyDelivered = c.notifications.some((n) => n.status === "SENT" || n.status === "QUEUED");

  function addToCalendar() {
    downloadIcs(
      `femur-${c.reference}.ics`,
      buildIcs({
        uid: c.reference,
        title: `${c.serviceName} — Femur Physiotherapy`,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
        location: clinicAddress,
        description: `Appointment reference ${c.reference}. Please arrive 10 minutes early.`,
      }),
    );
  }

  return (
    <div className="text-center sm:text-left">
      <span className={`mx-auto grid size-14 place-items-center rounded-full sm:mx-0 ${isPending ? "bg-sand-soft text-sand-deep" : "bg-mint-soft text-[#3d6e5c]"}`}>
        {isPending ? <Clock3 className="size-7" /> : <CheckCircle2 className="size-7" />}
      </span>
      <h1 className="mt-5 text-[2rem] leading-tight font-medium text-teal-deep sm:text-[2.4rem]">{isPending ? "Booking request received" : "You're booked in"}</h1>
      <p className="mt-2 text-ink-soft">
        {isPending ? "The clinic will confirm your appointment shortly. Keep your reference handy." : "We look forward to seeing you. Keep your reference handy."}
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-white text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-teal px-5 py-4 text-white">
          <div>
            <p className="text-xs tracking-wide text-white/60 uppercase">Appointment reference</p>
            <p className="font-mono text-xl font-semibold tracking-wider">{c.reference}</p>
          </div>
          <Badge tone={isPending ? "sand" : "mint"}>{isPending ? "Pending confirmation" : "Confirmed"}</Badge>
        </div>
        <dl className="grid gap-4 p-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-soft">Service</dt>
            <dd className="font-semibold text-ink">{c.serviceName}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Patient</dt>
            <dd className="font-semibold text-ink">{c.patientName}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Date & time</dt>
            <dd className="font-semibold text-ink">
              {formatDayLong(toDhakaDate(c.startsAt))}
              <span className="block font-normal text-ink-soft">{formatTimeRange(c.startsAt, c.endsAt)}</span>
            </dd>
          </div>
          <div>
            <dt className="text-ink-soft">Practitioner</dt>
            <dd className="font-semibold text-ink">{c.practitionerName ?? "Assigned before your visit"}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Fee</dt>
            <dd className="font-semibold text-ink">{formatMoney(c.charge.net, "Confirmed at the clinic")} · pay at clinic</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Location</dt>
            <dd className="text-ink">{clinicAddress}</dd>
          </div>
        </dl>
        <div className="border-t border-line bg-cream/60 px-5 py-4">
          <p className="mb-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">Notifications</p>
          <ul className="flex flex-wrap gap-2">
            {c.notifications.map((n) => {
              const { label, Icon } = CHANNEL[n.channel];
              const d = DELIVERY[n.status];
              return (
                <li key={n.channel} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs">
                  <Icon className="size-3.5 text-sage" /> {label}
                  <Badge tone={d.tone}>{d.label}</Badge>
                </li>
              );
            })}
          </ul>
          {!anyDelivered && <p className="mt-2 text-xs text-ink-soft">Message delivery isn&apos;t connected yet — please save your reference or add it to your calendar.</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-start">
        <Button variant="secondary" onClick={addToCalendar}>
          <CalendarPlus className="size-4" /> Add to calendar
        </Button>
        {isSignedIn ? (
          <ButtonLink href={routes.account.appointments}>View my appointments</ButtonLink>
        ) : (
          <ButtonLink href={routes.register}>Create a free account to manage bookings</ButtonLink>
        )}
        <Button variant="ghost" onClick={onBookAnother}>
          Book another
        </Button>
      </div>
    </div>
  );
}
