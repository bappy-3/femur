import { CalendarCheck2, HeartPulse, Stethoscope, UsersRound, type LucideIcon } from "lucide-react";
import type { Highlight } from "@/types/cms";

const ICONS: LucideIcon[] = [HeartPulse, UsersRound, CalendarCheck2, Stethoscope];

/** Trust indicators — factual service attributes only (no invented statistics). */
export function Highlights({ items }: { items: Highlight[] }) {
  return (
    <section aria-label="Key highlights" className="border-y border-line bg-white">
      <div className="container-page grid divide-line sm:grid-cols-2 sm:divide-x lg:grid-cols-4">
        {items.map((h, i) => {
          const Icon = ICONS[i % ICONS.length]!;
          return (
            <div key={h.title} data-reveal className="flex gap-4 border-b border-line py-7 sm:px-6 sm:first:pl-0 lg:border-b-0">
              <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-sage" strokeWidth={1.6} />
              <div>
                <p className="font-semibold text-ink">{h.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{h.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
