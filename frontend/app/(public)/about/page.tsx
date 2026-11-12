import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { PlaceholderMark } from "@/components/ui/placeholder";
import { routes } from "@/config/site";
import type { StoryBlock } from "@/types/cms";
import { api } from "@/services";

export const revalidate = 300;
export const metadata: Metadata = { title: "About Us", description: "Femur's mission, vision, values and philosophy of care." };

function Statement({ block }: { block: StoryBlock }) {
  return (
    <div data-reveal className="rounded-[var(--radius-card)] border border-line bg-white p-7">
      <h3 className="flex items-center gap-2 font-display text-2xl font-medium text-teal-deep">
        {block.title} {block.isPlaceholder && <PlaceholderMark />}
      </h3>
      <p className="mt-3 leading-relaxed text-ink-soft">{block.body}</p>
    </div>
  );
}

export default async function AboutPage() {
  const about = await api.cms.getAbout();
  return (
    <>
      <PageHero eyebrow="About Femur" title={<>Physiotherapy-led care, <em className="text-sage italic">built around people</em></>} intro={about.intro} />

      <Section>
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem]" data-reveal>
            <Image src={about.image.src} alt={about.image.alt} fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
          </div>
          <div className="space-y-5">
            <Statement block={about.story} />
            <Link href={routes.ourStory} className="inline-block font-semibold text-teal hover:text-teal-deep">Read our story →</Link>
          </div>
        </div>
      </Section>

      <Section tone="white" className="border-y border-line">
        <div className="container-page grid gap-5 md:grid-cols-2">
          <Statement block={about.mission} />
          <Statement block={about.vision} />
        </div>
      </Section>

      <Section>
        <div className="container-page">
          <SectionHeading index="01" eyebrow="Our values" title="What guides every session" />
          <div className="grid gap-px overflow-hidden rounded-[1.25rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <div key={v.title} data-reveal className="bg-white p-6">
                <h3 className="font-display text-xl font-medium text-teal-deep">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="mist">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading index="02" eyebrow="Philosophy of care" title={about.philosophy.title} intro={about.philosophy.body} className="mb-0" />
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {about.recoveryApproach.map((s, i) => (
              <li key={s.title} data-reveal className="rounded-[var(--radius-card)] border border-line bg-white p-6">
                <span className="font-display text-sm text-sand-deep">Step {i + 1}</span>
                <h3 className="mt-1 font-display text-xl font-medium text-teal-deep">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>
      <div className="pt-20">
        <CtaBand title="Come and meet us" body="Book an assessment and experience the Femur approach for yourself." />
      </div>
    </>
  );
}
