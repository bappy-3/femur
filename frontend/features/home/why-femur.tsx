import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/sections/section";
import { routes } from "@/config/site";
import type { HomeContent } from "@/types/cms";

export function WhyFemurSection({ content }: { content: HomeContent["whyFemur"] }) {
  return (
    <Section tone="white" className="border-y border-line">
      <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-sage uppercase">
            <span className="font-display text-sm tracking-normal text-sand-deep">02</span>
            <span aria-hidden className="h-px w-8 bg-sage/40" /> Why choose Femur
          </p>
          <h2 className="text-[2rem] leading-[1.08] font-medium text-teal-deep sm:text-[2.6rem]">{content.title}</h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-ink-soft">{content.intro}</p>
          <Link href={routes.whyFemur} className="mt-6 inline-flex items-center gap-2 font-semibold text-teal hover:text-teal-deep">
            What makes us different <ArrowRight className="size-4" />
          </Link>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2">
          {content.points.map((p, i) => (
            <li key={p.title} data-reveal className="bg-white p-6 sm:p-7">
              <span className="font-display text-3xl font-light text-sage-soft">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 font-sans text-[1.05rem] font-semibold tracking-normal text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
