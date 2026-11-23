import { ArrowRight, Stethoscope } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Bn } from "@/components/ui/bn";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { conditions } from "@/content/conditions";
import { ConditionCard } from "@/features/content/cards";
import { stock } from "@/services/mock/fixtures/images";

export const metadata: Metadata = {
  title: "Conditions we treat",
  description: "Back, neck, knee, shoulder, elbow, heel, joint and headache pain, plus pelvic floor recovery. Find your pain area and see how Femur can help.",
};

export default function ConditionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Conditions we treat"
        title={<>Where does it hurt? <Bn className="mt-3 block text-[0.55em] font-medium text-sage">কোথায় ব্যথা?</Bn></>}
        intro="Choose your pain area to see common causes, how we assess and treat it, and when to seek medical care first. Every plan starts with a proper assessment."
        image={stock.physioGuided.src}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={routes.booking} size="lg">Book an assessment <ArrowRight className="size-4" /></ButtonLink>
          <ButtonLink href={routes.treatments} variant="secondary" size="lg">Browse treatments</ButtonLink>
        </div>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {conditions.map((c, i) => (
              <li key={c.slug} className={i === 0 ? "sm:col-span-2 lg:col-span-2" : undefined}>
                <ConditionCard condition={c} priority={i < 3} className={i === 0 ? "h-full min-h-[20rem]" : "h-full"} />
              </li>
            ))}
          </ul>
          <aside className="mt-10 flex gap-4 rounded-2xl border border-line bg-white p-5 sm:items-center sm:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-mint-soft text-teal"><Stethoscope className="size-5" /></span>
            <p className="text-sm leading-relaxed text-ink-soft">
              <strong className="text-ink">Don&apos;t see your problem?</strong> Many complaints share the same approach. Book an assessment and we will work out the cause and the right plan, or advise you on who to see next.
            </p>
          </aside>
        </div>
      </section>

      <CtaBand title="Start with an assessment" body="Tell us what hurts and what you want to get back to. We will plan the rest together." />
    </>
  );
}
