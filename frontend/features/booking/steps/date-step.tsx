"use client";

import { CalendarX2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState, Skeleton } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/cn";
import { addDays, daysBetween, dhakaToday, formatDayShort, formatMonthYear, startOfWeek } from "@/lib/datetime";
import { api } from "@/services";
import type { Service } from "@/types/catalog";
import type { Gender, ISODate } from "@/types/common";
import { StepHeader } from "../step-header";

const WEEKDAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

export function DateStep({ service, gender, selected, onSelect }: { service: Service; gender: Gender; selected: ISODate | null; onSelect: (d: ISODate) => void }) {
  const today = dhakaToday();
  const days = Math.min(service.rules.maxDaysAhead + 1, 42);
  const { data, loading, error, reload } = useAsync(() => api.availability.listDates({ serviceId: service.id, gender, from: today, days }), [service.id, gender, today, days]);

  const available = new Set((data ?? []).filter((d) => d.hasSlots).map((d) => d.date));
  const lastDate = addDays(today, days - 1);
  const gridStart = startOfWeek(today);
  const weeks = Math.ceil((daysBetween(gridStart, lastDate) + 1) / 7);
  const cells = Array.from({ length: weeks * 7 }, (_, i) => addDays(gridStart, i));
  const firstAvailable = [...available].sort()[0];

  return (
    <div>
      <StepHeader step={4} title="Choose a date" description={`Showing the next ${days} days. Days without free times are greyed out.`} />
      {service.availabilityNote && (
        <p className="mb-5 flex items-center gap-2 rounded-xl bg-sand-soft/70 px-4 py-2.5 text-sm text-sand-deep">
          <Info className="size-4 shrink-0" /> {service.availabilityNote}
        </p>
      )}
      {error && (
        <Alert tone="error" title="Couldn't load availability" className="mb-5">
          {error}{" "}
          <button className="font-semibold underline" onClick={reload}>
            Try again
          </button>
        </Alert>
      )}
      {loading ? (
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 35 }, (_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : !error && available.size === 0 ? (
        <EmptyState
          icon={<CalendarX2 className="size-5" />}
          title="No available dates in the booking window"
          description="All slots are currently booked or the specialist has no upcoming visiting days. Please call the clinic and we'll help you find a time."
        />
      ) : (
        <>
          {firstAvailable && firstAvailable !== selected && (
            <Button variant="secondary" size="sm" className="mb-4" onClick={() => onSelect(firstAvailable)}>
              Earliest available: {formatDayShort(firstAvailable)}
            </Button>
          )}
          <div role="grid" aria-label="Available dates" className="rounded-2xl border border-line bg-white p-3 sm:p-4">
            <div role="row" className="mb-1 grid grid-cols-7 gap-1.5">
              {WEEKDAYS.map((w) => (
                <span key={w} role="columnheader" className="py-1 text-center text-[0.7rem] font-semibold tracking-wide text-ink-soft uppercase">
                  {w}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {cells.map((date) => {
                const inWindow = date >= today && date <= lastDate;
                const isAvailable = inWindow && available.has(date);
                const isSelected = date === selected;
                const day = Number(date.slice(8));
                return (
                  <button
                    key={date}
                    type="button"
                    role="gridcell"
                    disabled={!isAvailable}
                    aria-selected={isSelected}
                    aria-label={`${formatDayShort(date)}${isAvailable ? "" : " — unavailable"}`}
                    onClick={() => onSelect(date)}
                    className={cn(
                      "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-colors",
                      !inWindow && "invisible",
                      isSelected ? "bg-teal font-semibold text-white" : isAvailable ? "bg-mist font-semibold text-teal-deep hover:bg-mint-soft" : "text-ink/30",
                    )}
                  >
                    {(day === 1 || date === today) && (
                      <span className={cn("absolute top-1 text-[0.55rem] font-semibold uppercase", isSelected ? "text-white/70" : "text-ink-soft")}>
                        {date === today ? "Today" : formatMonthYear(date).slice(0, 3)}
                      </span>
                    )}
                    {day}
                    {isAvailable && !isSelected && <span className="absolute bottom-1.5 size-1 rounded-full bg-mint" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
