"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { STEP_LABELS, STEPS, type Step } from "./booking-state";

const VISIBLE = STEPS.filter((s): s is Exclude<Step, "done"> => s !== "done");

export function BookingProgress({ current, reachable, onGoTo }: { current: Step; reachable: Step; onGoTo: (s: Step) => void }) {
  const currentIndex = STEPS.indexOf(current);
  const reachableIndex = STEPS.indexOf(reachable);
  return (
    <nav aria-label="Booking progress" className="mb-8">
      <div className="mb-3 h-1 overflow-hidden rounded-full bg-ink/[0.06] sm:hidden">
        <div className="h-full rounded-full bg-teal transition-[width] duration-500" style={{ width: `${((currentIndex + 1) / VISIBLE.length) * 100}%` }} />
      </div>
      <ol className="hidden items-center gap-1 sm:flex">
        {VISIBLE.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const canGo = i <= reachableIndex && !active;
          return (
            <li key={step} className="flex flex-1 items-center gap-1">
              <button
                type="button"
                disabled={!canGo}
                onClick={() => onGoTo(step)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm font-medium whitespace-nowrap transition-colors",
                  active ? "bg-teal text-white" : done ? "text-teal hover:bg-mist" : "text-ink-soft/70",
                  canGo && "cursor-pointer",
                )}
              >
                <span className={cn("grid size-6 place-items-center rounded-full text-xs", active ? "bg-white/20" : done ? "bg-mint-soft text-teal" : "bg-ink/[0.06]")}>
                  {done ? <Check className="size-3.5" /> : i + 1}
                </span>
                {STEP_LABELS[step]}
              </button>
              {i < VISIBLE.length - 1 && <span aria-hidden className={cn("h-px flex-1", done ? "bg-sage/50" : "bg-line")} />}
            </li>
          );
        })}
      </ol>
      <p className="text-sm font-medium text-ink-soft sm:hidden">
        Step {Math.min(currentIndex + 1, VISIBLE.length)} of {VISIBLE.length} · {STEP_LABELS[current as Exclude<Step, "done">]}
      </p>
    </nav>
  );
}
