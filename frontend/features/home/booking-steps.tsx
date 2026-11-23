import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/sections/section";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import type { Highlight } from "@/types/cms";

export function BookingSteps({ steps }: { steps: Highlight[] }) {
  return (
    <Section tone="white">
      <div className="container-page">
        <SectionHeading index="05" eyebrow="How booking works" title="From pain to plan in four simple steps" align="center" />
        <ol className="relative grid gap-6 md:grid-cols-4">
          <span aria-hidden className="absolute top-7 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-sage/0 via-sage/50 to-sage/0 md:block" />
          {steps.map((s, i) => (
            <li key={s.title} data-reveal className="relative text-center">
              <span className="relative mx-auto grid size-14 place-items-center rounded-full border border-sage/30 bg-white font-display text-xl text-teal shadow-[var(--shadow-soft)]">
                {i + 1}
              </span>
              <h3 className="mt-5 font-sans text-base font-semibold tracking-normal text-ink">{s.title}</h3>
              <p className="mx-auto mt-1.5 max-w-[16rem] text-sm leading-relaxed text-ink-soft">{s.description}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 text-center">
          <ButtonLink href={routes.booking} size="lg">
            Start booking <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
