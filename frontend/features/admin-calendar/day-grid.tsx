"use client";

import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Monogram } from "@/components/ui/monogram";
import { isReschedulable } from "@/lib/appointment-status";
import { cn } from "@/lib/cn";
import { dhakaDateTimeToUtc, dhakaMinutesOfDay, dhakaToday, formatTime, minutesToTime, parseTime, toDhakaDate } from "@/lib/datetime";
import type { CalendarData } from "@/types/admin";
import { ACTIVE_STATUSES, type Appointment } from "@/types/appointment";
import type { ID, ISODate } from "@/types/common";
import { fitsWorkingRanges, layoutColumn, minutesToPx, pxToMinutes, ROW_PX, timeRows } from "./calendar-layout";
import { BLOCK_STYLE } from "./status-style";

interface Props {
  data: CalendarData;
  date: ISODate;
  showCancelled: boolean;
  onSelect: (a: Appointment) => void;
  onCreateAt: (practitionerId: ID, startsAt: string) => void;
  onMove: (a: Appointment, practitionerId: ID, startsAt: string) => void;
}

interface DragState {
  appointment: Appointment;
  duration: number;
}

export function DayGrid({ data, date, showCancelled, onSelect, onCreateAt, onMove }: Props) {
  const dayStart = parseTime(data.clinicHours.start);
  const rows = timeRows(data.clinicHours.start, data.clinicHours.end);
  const height = rows.length * ROW_PX;
  const [drag, setDrag] = useState<DragState | null>(null);
  const [target, setTarget] = useState<{ practitionerId: ID; minute: number } | null>(null);
  const [hover, setHover] = useState<{ practitionerId: ID; minute: number } | null>(null);
  const [nowMin, setNowMin] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isToday = date === dhakaToday();

  useEffect(() => {
    const tick = () => setNowMin(dhakaMinutesOfDay(new Date()));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  // Scroll to "now" (or first working hour) on load.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const focusMin = isToday && nowMin !== null ? nowMin - 60 : dayStart;
    el.scrollTop = Math.max(0, minutesToPx(focusMin, dayStart));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, data.practitioners.length]);

  const byPractitioner = useMemo(() => {
    const map = new Map<ID, Appointment[]>();
    for (const a of data.appointments) {
      if (toDhakaDate(a.startsAt) !== date) continue;
      if (!showCancelled && (a.status === "CANCELLED" || a.status === "REJECTED")) continue;
      map.set(a.assignedPractitionerId, [...(map.get(a.assignedPractitionerId) ?? []), a]);
    }
    return map;
  }, [data.appointments, date, showCancelled]);

  const rangesFor = (pid: ID) => data.availability.find((a) => a.practitionerId === pid && a.date === date)?.ranges ?? [];

  const minuteFromEvent = (e: React.MouseEvent | React.DragEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return pxToMinutes(e.clientY - rect.top, dayStart);
  };

  const conflicts = (pid: ID, start: number, duration: number, ignore?: ID) =>
    (byPractitioner.get(pid) ?? []).some((a) => {
      if (a.id === ignore || !ACTIVE_STATUSES.includes(a.status)) return false;
      const s = dhakaMinutesOfDay(a.startsAt);
      const e = dhakaMinutesOfDay(a.endsAt);
      return s < start + duration && e > start;
    }) ||
    data.blocks.some((b) => (b.practitionerId === null || b.practitionerId === pid) && toDhakaDate(b.startsAt) === date && dhakaMinutesOfDay(b.startsAt) < start + duration && dhakaMinutesOfDay(b.endsAt) > start);

  const cols = data.practitioners.length;
  const gridTemplate = { gridTemplateColumns: `4.25rem repeat(${cols}, minmax(11.5rem, 1fr))` };

  return (
    <div ref={scrollRef} className="relative max-h-[calc(100dvh-16rem)] min-h-[28rem] overflow-auto rounded-2xl border border-line bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 grid border-b border-line bg-white/95 backdrop-blur" style={gridTemplate}>
        <div className="sticky left-0 z-10 bg-white" />
        {data.practitioners.map((p) => {
          const ranges = rangesFor(p.id);
          const count = (byPractitioner.get(p.id) ?? []).filter((a) => ACTIVE_STATUSES.includes(a.status) || a.status === "COMPLETED").length;
          return (
            <div key={p.id} className="flex items-center gap-2.5 border-l border-line px-3 py-2.5">
              <Monogram name={p.displayName} color={p.color} className="size-8 text-xs" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{p.displayName}</p>
                <p className="truncate text-[0.7rem] text-ink-soft">
                  {p.gender === "FEMALE" ? "F" : "M"} · {ranges.length ? ranges.map((r) => `${r.start}–${r.end}`).join(", ") : "Off today"} · {count} booked
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="grid" style={gridTemplate}>
        {/* Time gutter */}
        <div className="sticky left-0 z-10 border-r border-line bg-white" style={{ height }}>
          {rows.map((m) =>
            m % 60 === 0 ? (
              <span key={m} className="absolute right-2 -translate-y-1/2 text-[0.68rem] font-medium text-ink-soft" style={{ top: minutesToPx(m, dayStart) }}>
                {formatClockShort(m)}
              </span>
            ) : null,
          )}
        </div>

        {data.practitioners.map((p) => {
          const ranges = rangesFor(p.id);
          const items = layoutColumn(byPractitioner.get(p.id) ?? [], dayStart);
          const blocks = data.blocks.filter((b) => (b.practitionerId === null || b.practitionerId === p.id) && toDhakaDate(b.startsAt) === date);
          const isTarget = target?.practitionerId === p.id && drag;
          const ghostOk = isTarget && fitsWorkingRanges(ranges, target.minute, drag.duration) && !conflicts(p.id, target.minute, drag.duration, drag.appointment.id);
          const hoverHere = hover?.practitionerId === p.id && !drag;
          const hoverOk = hoverHere && fitsWorkingRanges(ranges, hover.minute, SLOT) && !conflicts(p.id, hover.minute, SLOT);

          return (
            <div
              key={p.id}
              className="relative cursor-pointer border-l border-line bg-offduty bg-cream/40"
              style={{ height }}
              onMouseMove={(e) => setHover({ practitionerId: p.id, minute: minuteFromEvent(e) })}
              onMouseLeave={() => setHover(null)}
              onClick={(e) => {
                const minute = minuteFromEvent(e);
                if (fitsWorkingRanges(ranges, minute, SLOT) && !conflicts(p.id, minute, SLOT)) onCreateAt(p.id, dhakaDateTimeToUtc(date, minute).toISOString());
              }}
              onDragOver={(e) => {
                if (!drag) return;
                e.preventDefault();
                const minute = minuteFromEvent(e);
                if (target?.minute !== minute || target.practitionerId !== p.id) setTarget({ practitionerId: p.id, minute });
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (drag && target) onMove(drag.appointment, p.id, dhakaDateTimeToUtc(date, target.minute).toISOString());
                setDrag(null);
                setTarget(null);
              }}
            >
              {/* Working hours */}
              {ranges.map((r) => (
                <div key={r.start} aria-hidden className="absolute inset-x-0 bg-white" style={{ top: minutesToPx(parseTime(r.start), dayStart), height: minutesToPx(parseTime(r.end), dayStart) - minutesToPx(parseTime(r.start), dayStart) }} />
              ))}
              {/* Grid lines */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgb(37 56 59 / 0.09) 1px, transparent 1px), linear-gradient(to bottom, rgb(37 56 59 / 0.035) 1px, transparent 1px)`,
                  backgroundSize: `100% ${ROW_PX * 4}px, 100% ${ROW_PX}px`,
                }}
              />
              {/* Blocked time */}
              {blocks.map((b) => {
                const top = minutesToPx(dhakaMinutesOfDay(b.startsAt), dayStart);
                return (
                  <div key={b.id} className="absolute inset-x-1 z-[1] rounded-md border border-line bg-blocked px-2 py-1 text-[0.7rem] font-semibold text-ink-soft" style={{ top, height: minutesToPx(dhakaMinutesOfDay(b.endsAt), dayStart) - top }} onClick={(e) => e.stopPropagation()}>
                    Blocked · {b.reason}
                  </div>
                );
              })}
              {/* Hover affordance */}
              {hoverOk && (
                <div aria-hidden className="pointer-events-none absolute inset-x-1 z-[2] flex items-center gap-1 rounded-md border border-dashed border-sage/60 bg-mist/80 px-2 text-[0.7rem] font-semibold text-teal" style={{ top: minutesToPx(hover.minute, dayStart), height: ROW_PX * 2 }}>
                  <Plus className="size-3" /> {formatClockShort(hover.minute, true)}
                </div>
              )}
              {/* Appointments */}
              {items.map(({ item: a, top, height: h, lane, lanes }) => {
                const draggable = isReschedulable(a.status);
                return (
                  <button
                    key={a.id}
                    type="button"
                    draggable={draggable}
                    onDragStart={(e) => {
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", a.id);
                      setDrag({ appointment: a, duration: dhakaMinutesOfDay(a.endsAt) - dhakaMinutesOfDay(a.startsAt) });
                    }}
                    onDragEnd={() => {
                      setDrag(null);
                      setTarget(null);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(a);
                    }}
                    onMouseMove={(e) => e.stopPropagation()}
                    className={cn(
                      "absolute z-[3] overflow-hidden rounded-lg border-l-[3px] border px-2 py-1 text-left text-[0.72rem] leading-tight shadow-sm transition-[box-shadow,opacity] hover:shadow-[var(--shadow-soft)] focus-visible:z-10",
                      BLOCK_STYLE[a.status],
                      draggable && "cursor-grab active:cursor-grabbing",
                      drag?.appointment.id === a.id && "opacity-40",
                    )}
                    style={{ top: top + 1, height: h - 2, left: `calc(${(lane / lanes) * 100}% + 4px)`, width: `calc(${100 / lanes}% - 8px)` }}
                    title={`${a.patient.fullName} · ${a.serviceName} · ${formatTime(a.startsAt)}`}
                  >
                    <span className="block font-semibold">
                      {formatTime(a.startsAt)} {h > 40 ? "" : `· ${a.patient.fullName}`}
                    </span>
                    {h > 40 && <span className="block truncate font-semibold">{a.patient.fullName}</span>}
                    {h > 56 && <span className="block truncate opacity-80">{a.serviceName}</span>}
                  </button>
                );
              })}
              {/* Drop ghost */}
              {isTarget && (
                <div
                  aria-hidden
                  className={cn("pointer-events-none absolute inset-x-1 z-[4] rounded-lg border-2 border-dashed px-2 py-1 text-[0.7rem] font-semibold", ghostOk ? "border-teal bg-teal/10 text-teal" : "border-rose bg-rose-soft/80 text-rose")}
                  style={{ top: minutesToPx(target.minute, dayStart), height: minutesToPx(target.minute + drag.duration, dayStart) - minutesToPx(target.minute, dayStart) }}
                >
                  {formatClockShort(target.minute, true)} {ghostOk ? "" : "· unavailable"}
                </div>
              )}
              {/* Now line */}
              {isToday && nowMin !== null && nowMin >= dayStart && nowMin <= parseTime(data.clinicHours.end) && (
                <div aria-hidden className="pointer-events-none absolute inset-x-0 z-[5] h-0.5 bg-rose" style={{ top: minutesToPx(nowMin, dayStart) }}>
                  <span className="absolute -top-1 -left-1 size-2.5 rounded-full bg-rose" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const SLOT = 30; // minimum free minutes for click-to-create

function formatClockShort(minutes: number, withMinutes = false) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  const suffix = h >= 12 ? "pm" : "am";
  return withMinutes || m ? `${h12}:${minutesToTime(m).slice(3)} ${suffix}` : `${h12} ${suffix}`;
}
