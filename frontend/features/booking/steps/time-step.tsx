"use client";

import { Moon, Sun, Sunrise } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState, Skeleton } from "@/components/ui/feedback";
import { useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/cn";
import { dhakaMinutesOfDay, formatDayLong, formatTime } from "@/lib/datetime";
import { api } from "@/services";
import type { AvailabilitySlot } from "@/types/appointment";
import type { Service } from "@/types/catalog";
import type { Gender, ISODate } from "@/types/common";
import { StepHeader } from "../step-header";

const PERIODS = [
  { key: "morning", label: "Morning", Icon: Sunrise, test: (m: number) => m < 12 * 60 },
  { key: "afternoon", label: "Afternoon", Icon: Sun, test: (m: number) => m >= 12 * 60 && m < 17 * 60 },
  { key: "evening", label: "Evening", Icon: Moon, test: (m: number) => m >= 17 * 60 },
];

interface Props {
  service: Service;
  gender: Gender;
  date: ISODate;
  selected: AvailabilitySlot | null;
  onSelect: (slot: AvailabilitySlot) => void;
  onChangeDate: () => void;
  notice?: string | null;
}

export function TimeStep({ service, gender, date, selected, onSelect, onChangeDate, notice }: Props) {
  const { data, loading, error, reload } = useAsync(() => api.availability.listSlots({ serviceId: service.id, gender, date }), [service.id, gender, date, notice]);
  const slots = data ?? [];

  return (
    <div>
      <StepHeader
        step={5}
        title="Pick a time"
        description={
          <>
            {formatDayLong(date)} ·{" "}
            <button type="button" onClick={onChangeDate} className="font-semibold text-teal hover:text-teal-deep">
              change date
            </button>
          </>
        }
      />
      {notice && (
        <Alert tone="warning" className="mb-5">
          {notice}
        </Alert>
      )}
      {error && (
        <Alert tone="error" title="Couldn't load times" className="mb-5">
          {error}{" "}
          <button className="font-semibold underline" onClick={reload}>
            Try again
          </button>
        </Alert>
      )}
      {loading ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-12 rounded-xl" />
          ))}
        </div>
      ) : !error && slots.length === 0 ? (
        <EmptyState title="No times left on this day" description="This day has just filled up. Please choose another date." action={<Button onClick={onChangeDate}>Choose another date</Button>} />
      ) : (
        <div className="space-y-6">
          {PERIODS.map(({ key, label, Icon, test }) => {
            const group = slots.filter((s) => test(dhakaMinutesOfDay(s.startsAt)));
            if (group.length === 0) return null;
            return (
              <section key={key} aria-label={label}>
                <h2 className="mb-2.5 flex items-center gap-2 font-sans text-sm font-semibold tracking-normal text-ink-soft">
                  <Icon className="size-4 text-sage" /> {label}
                </h2>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {group.map((slot) => {
                    const isSelected = selected?.startsAt === slot.startsAt;
                    return (
                      <button
                        key={slot.startsAt}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onSelect(slot)}
                        className={cn(
                          "h-12 rounded-xl border text-[0.95rem] font-semibold transition-all",
                          isSelected ? "border-teal bg-teal text-white" : "border-line bg-white text-teal-deep hover:border-sage hover:bg-mist",
                        )}
                      >
                        {formatTime(slot.startsAt)}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
          <p className="text-xs text-ink-soft">All times are Bangladesh time (GMT+6). Sessions last about {service.rules.durationMinutes} minutes.</p>
        </div>
      )}
    </div>
  );
}
