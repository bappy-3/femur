import { CalendarCheck2, ClipboardList, HeartHandshake, Leaf, PlusSquare, ShieldCheck, UsersRound, type LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/sections/section";
import { api } from "@/services";

export const revalidate = 300;
export const metadata: Metadata = { title: "Why Femur", description: "What you can expect from care at Femur Physiotherapy & Wellness Center." };

const ICONS: Record<string, LucideIcon> = {
  clipboard: ClipboardList,
  heart: HeartHandshake,
  shield: ShieldCheck,
  users: UsersRound,
  calendar: CalendarCheck2,
  leaf: Leaf,
  plus: PlusSquare,
};

export default async function WhyFemurPage() {
  const content = await api.cms.getWhyFemur();
  return (
    <>
      <PageHero eyebrow="Why Femur" title={<>Thoughtful care, <em className="text-sage italic">clearly delivered</em></>} intro={content.intro} />
      <Section>
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.differentiators.map((d, i) => {
            const Icon = ICONS[d.icon] ?? ClipboardList;
            return (
              <article key={d.title} data-reveal className={i === 0 ? "rounded-[1.25rem] bg-teal p-7 text-white sm:col-span-2 lg:col-span-1 lg:row-span-2" : "rounded-[1.25rem] border border-line bg-white p-7"}>
                <Icon className={i === 0 ? "size-8 text-sand" : "size-7 text-sage"} strokeWidth={1.6} />
                <h2 className={`mt-6 font-display text-2xl font-medium ${i === 0 ? "text-white" : "text-teal-deep"}`}>{d.title}</h2>
                <p className={`mt-3 leading-relaxed ${i === 0 ? "text-white/75" : "text-ink-soft"}`}>{d.description}</p>
              </article>
            );
          })}
        </div>
      </Section>
      <CtaBand title="See the difference for yourself" body="Book an assessment with a Femur physiotherapist." />
    </>
  );
}
