import Image from "next/image";
import { Section, SectionHeading } from "@/components/sections/section";
import type { HomeContent } from "@/types/cms";

export function ApproachSection({ content }: { content: HomeContent["approach"] }) {
  return (
    <Section tone="teal" className="relative overflow-hidden">
      <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="relative order-last aspect-[4/5] overflow-hidden rounded-[1.75rem] lg:order-first" data-reveal>
          <Image src={content.image.src} alt={content.image.alt} fill sizes="(min-width: 1024px) 520px, 92vw" className="object-cover" loading="lazy" />
        </div>
        <div>
          <SectionHeading inverse index="03" eyebrow="Our approach" title={content.title} intro={content.intro} className="mb-10" />
          <ol className="relative space-y-1">
            {content.steps.map((step, i) => (
              <li key={step.title} data-reveal className="group relative grid grid-cols-[3rem_1fr] gap-4 rounded-2xl p-4 transition-colors hover:bg-white/5">
                <span className="grid size-12 place-items-center rounded-full border border-white/20 font-display text-lg text-sand">{i + 1}</span>
                <div className="pt-1">
                  <h3 className="font-display text-xl font-medium text-white">{step.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-white/70">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
