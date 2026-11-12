import { Quote } from "lucide-react";
import { Section, SectionHeading } from "@/components/sections/section";
import { PlaceholderMark } from "@/components/ui/placeholder";
import type { Testimonial } from "@/types/cms";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;
  return (
    <Section>
      <div className="container-page">
        <SectionHeading index="08" eyebrow="Patient stories" title="In our patients' words" align="center" />
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} data-reveal className="flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-6">
              <Quote aria-hidden className="size-7 text-sand" />
              <blockquote className="mt-4 flex-1 font-display text-[1.15rem] leading-relaxed text-teal-deep">{t.quote}</blockquote>
              <figcaption className="mt-6 flex items-center justify-between gap-2 border-t border-line pt-4 text-sm">
                <span>
                  <span className="block font-semibold text-ink">{t.authorDisplay}</span>
                  <span className="text-ink-soft">{t.context}</span>
                </span>
                {t.isSample && <PlaceholderMark label="Sample" />}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Section>
  );
}
