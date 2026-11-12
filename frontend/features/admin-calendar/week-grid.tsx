"use client";

import { Monogram } from "@/components/ui/monogram";
import { cn } from "@/lib/cn";
import { addDays, dhakaToday, formatTime, formatWeekday, toDhakaDate } from "@/lib/datetime";
import type { CalendarData } from "@/types/admin";
import type { Appointment } from "@/types/appointment";
import type { ISODate } from "@/types/common";
import { BLOCK_STYLE } from "./status-style";

const MAX_CHIPS = 5;

/** Resource × day matrix: practitioners as rows, the 7 days as columns. */
export function WeekGrid({ data, weekStart, showCancelled, onSelect, onOpenDay }: { data: CalendarData; weekStart: ISODate; showCancelled: boolean; onSelect: (a: Appointment) => void; onOpenDay: (d: ISODate) => void }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = dhakaToday();
  const template = { gridTemplateColumns: `12rem repeat(7, minmax(8.5rem, 1fr))` };

  return (
    <div className="max-h-[calc(100dvh-16rem)] min-h-[28rem] overflow-auto rounded-2xl border border-line bg-white">
      <div className="sticky top-0 z-20 grid border-b border-line bg-white/95 backdrop-blur" style={template}>
        <div className="sticky left-0 z-10 bg-white px-3 py-2.5 text-xs font-semibold tracking-wide text-ink-soft uppercase">Practitioner</div>
        {days.map((d) => (
          <button key={d} type="button" onClick={() => onOpenDay(d)} className={cn("border-l border-line px-3 py-2 text-left hover:bg-mist", d === today && "bg-mist")}>
            <span className="block text-[0.7rem] font-semibold tracking-wide text-ink-soft uppercase">{formatWeekday(d)}</span>
            <span className={cn("font-display text-lg", d === today ? "text-teal" : "text-ink")}>{Number(d.slice(8))}</span>
          </button>
        ))}
      </div>
      {data.practitioners.map((p) => (
        <div key={p.id} className="grid border-b border-line last:border-b-0" style={template}>
          <div className="sticky left-0 z-10 flex items-center gap-2.5 border-r border-line bg-white px-3 py-3">
            <Monogram name={p.displayName} color={p.color} className="size-8 text-xs" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{p.displayName}</p>
              <p className="truncate text-[0.7rem] text-ink-soft">{p.designation}</p>
            </div>
          </div>
          {days.map((d) => {
            const ranges = data.availability.find((a) => a.practitionerId === p.id && a.date === d)?.ranges ?? [];
            const appts = data.appointments
              .filter((a) => a.assignedPractitionerId === p.id && toDhakaDate(a.startsAt) === d && (showCancelled || (a.status !== "CANCELLED" && a.status !== "REJECTED")))
              .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
            const off = ranges.length === 0;
            return (
              <div key={d} className={cn("min-h-24 space-y-1 border-l border-line p-1.5", off ? "bg-offduty bg-cream/50" : d === today && "bg-mist/40")}>
                {off ? (
                  appts.length === 0 && <p className="px-1 pt-1 text-[0.7rem] text-ink-soft/70">Off</p>
                ) : (
                  <p className="px-1 text-[0.65rem] text-ink-soft">{ranges.map((r) => `${r.start}–${r.end}`).join(", ")}</p>
                )}
                {appts.slice(0, MAX_CHIPS).map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onSelect(a)}
                    className={cn("block w-full truncate rounded-md border border-l-[3px] px-1.5 py-0.5 text-left text-[0.7rem] leading-snug", BLOCK_STYLE[a.status])}
                    title={`${a.patient.fullName} · ${a.serviceName}`}
                  >
                    <span className="font-semibold">{formatTime(a.startsAt)}</span> {a.patient.fullName}
                  </button>
                ))}
                {appts.length > MAX_CHIPS && (
                  <button type="button" onClick={() => onOpenDay(d)} className="w-full rounded-md px-1.5 py-0.5 text-left text-[0.7rem] font-semibold text-teal hover:bg-mist">
                    +{appts.length - MAX_CHIPS} more
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
