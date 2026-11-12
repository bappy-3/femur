"use client";

import { addDays, dhakaToday } from "@/lib/datetime";
import { cn } from "@/lib/cn";
import type { ISODate } from "@/types/common";

export interface Range {
  from: ISODate;
  to: ISODate;
}

export const PRESETS = [
  { key: "today", label: "Today", range: (): Range => ({ from: dhakaToday(), to: dhakaToday() }) },
  { key: "7d", label: "Last 7 days", range: (): Range => ({ from: addDays(dhakaToday(), -6), to: dhakaToday() }) },
  { key: "14d", label: "Last 14 days", range: (): Range => ({ from: addDays(dhakaToday(), -13), to: dhakaToday() }) },
  { key: "next7", label: "Next 7 days", range: (): Range => ({ from: dhakaToday(), to: addDays(dhakaToday(), 6) }) },
] as const;

/** Preset chips + explicit from/to inputs, in one row above the content. */
export function DateRangeFilter({ value, onChange, presets = ["today", "7d", "14d"] }: { value: Range; onChange: (r: Range) => void; presets?: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESETS.filter((p) => presets.includes(p.key)).map((p) => {
        const r = p.range();
        const active = r.from === value.from && r.to === value.to;
        return (
          <button key={p.key} onClick={() => onChange(r)} className={cn("h-9 rounded-full border px-3.5 text-sm font-medium", active ? "border-teal bg-teal text-white" : "border-line bg-white text-ink-soft hover:text-ink")}>
            {p.label}
          </button>
        );
      })}
      <input type="date" aria-label="From" value={value.from} max={value.to} onChange={(e) => e.target.value && onChange({ ...value, from: e.target.value })} className="h-9 rounded-full border border-line bg-white px-3 text-sm" />
      <span className="text-ink-soft">–</span>
      <input type="date" aria-label="To" value={value.to} min={value.from} onChange={(e) => e.target.value && onChange({ ...value, to: e.target.value })} className="h-9 rounded-full border border-line bg-white px-3 text-sm" />
    </div>
  );
}
