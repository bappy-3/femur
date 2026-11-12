import { CalendarDays, Clock } from "lucide-react";
import type { ReactNode } from "react";
import { AppointmentStatusBadge } from "@/components/ui/status-badge";
import { formatDayLong, formatMonthShort, formatTimeRange, toDhakaDate } from "@/lib/datetime";
import type { Appointment } from "@/types/appointment";

export function AppointmentCard({ appointment: a, actions }: { appointment: Appointment; actions?: ReactNode }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center">
      <div className="grid w-16 shrink-0 place-items-center rounded-xl bg-mist py-2 text-center">
        <span className="text-[0.7rem] font-semibold tracking-wide text-sage uppercase">{formatMonthShort(toDhakaDate(a.startsAt))}</span>
        <span className="font-display text-2xl leading-none font-medium text-teal-deep">{Number(toDhakaDate(a.startsAt).slice(8))}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-sans text-base font-semibold tracking-normal text-ink">{a.serviceName}</h3>
          <AppointmentStatusBadge status={a.status} />
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" /> {formatDayLong(toDhakaDate(a.startsAt))}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> {formatTimeRange(a.startsAt, a.endsAt)}
          </span>
        </p>
        <p className="mt-1 text-xs text-ink-soft">
          For <strong className="font-semibold text-ink">{a.patient.fullName}</strong> · Ref <span className="font-mono">{a.reference}</span>
        </p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </article>
  );
}
