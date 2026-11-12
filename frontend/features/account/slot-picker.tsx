"use client";

import { Skeleton } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/cn";
import { dhakaToday, formatDayShort, formatTime } from "@/lib/datetime";
import { api } from "@/services";
import type { AvailabilitySlot } from "@/types/appointment";
import type { Gender, ID, ISODate } from "@/types/common";

/** Compact date strip + time grid, reused for patient rescheduling. Availability comes from the API. */
export function SlotPicker({
  serviceId,
  gender,
  date,
  onDateChange,
  selected,
  onSelect,
  days = 21,
}: {
  serviceId: ID;
  gender: Gender;
  date: ISODate | null;
  onDateChange: (d: ISODate) => void;
  selected: AvailabilitySlot | null;
  onSelect: (s: AvailabilitySlot) => void;
  days?: number;
}) {
  const dates = useAsync(() => api.availability.listDates({ serviceId, gender, from: dhakaToday(), days }), [serviceId, gender, days]);
  const slots = useAsync(() => (date ? api.availability.listSlots({ serviceId, gender, date }) : Promise.resolve([])), [serviceId, gender, date]);
  const available = (dates.data ?? []).filter((d) => d.hasSlots);

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Date</p>
        {dates.loading ? (
          <Skeleton className="h-12" />
        ) : available.length === 0 ? (
          <p className="text-sm text-ink-soft">No available dates in the next {days} days.</p>
        ) : (
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {available.map((d) => (
              <button
                key={d.date}
                type="button"
                onClick={() => onDateChange(d.date)}
                className={cn("shrink-0 rounded-xl border px-3 py-2 text-sm font-medium", d.date === date ? "border-teal bg-teal text-white" : "border-line bg-white hover:border-sage")}
              >
                {formatDayShort(d.date)}
              </button>
            ))}
          </div>
        )}
      </div>
      {date && (
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Time</p>
          {slots.loading ? (
            <Skeleton className="h-24" />
          ) : (slots.data ?? []).length === 0 ? (
            <p className="text-sm text-ink-soft">No times left on this day.</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {(slots.data ?? []).map((s) => (
                <button
                  key={s.startsAt}
                  type="button"
                  onClick={() => onSelect(s)}
                  className={cn("h-10 rounded-lg border text-sm font-semibold", selected?.startsAt === s.startsAt ? "border-teal bg-teal text-white" : "border-line bg-white text-teal-deep hover:border-sage")}
                >
                  {formatTime(s.startsAt)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
