import { ArrowRight, Dumbbell, HandHeart, Microscope } from "lucide-react";
import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Bn } from "@/components/ui/bn";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { treatments } from "@/content/treatments";
import { TreatmentCard } from "@/features/content/cards";
import { stock } from "@/services/mock/fixtures/images";

export const metadata: Metadata = {
  title: "Treatments & technology",
  description: "Manual therapy, shockwave, PEMF, acupuncture, cryotherapy and more. See how each treatment works, what it feels like and who it suits.",
};

const principles = [
  { icon: Microscope, title: "Assessment first", body: "We find the likely source of your pain before choosing a technique, so treatment is never a guess." },
  { icon: HandHeart, title: "Hands-on and device-based care", body: "Technology is a support for good hands-on care, never a substitute for it." },
  { icon: Dumbbell, title: "Built around exercise", body: "Relief matters, but lasting change comes from strength, movement and habits. Every plan includes them." },
];

export default function TreatmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Treatments & technology"
        title={<>Modern tools, chosen with care <Bn className="mt-3 block text-[0.55em] font-medium text-sage">আধুনিক চিকিৎসা, যত্নের সঙ্গে</Bn></>}
        intro="From skilled manual therapy to shockwave, PEMF and acupuncture. Learn what each treatment involves before you decide."
        image={stock.manualTherapy.src}
      >
        <ButtonLink href={routes.booking} size="lg">Book an assessment <ArrowRight className="size-4" /></ButtonLink>
      </PageHero>

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-4 md:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title} data-reveal className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-mint-soft text-teal"><p.icon className="size-5" /></span>
              <h2 className="mt-4 font-sans text-lg font-semibold tracking-normal text-ink">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="container-page">
          <h2 className="mb-8 text-[1.9rem] font-medium text-teal-deep">All treatments</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {treatments.map((t) => <TreatmentCard key={t.slug} treatment={t} />)}
          </div>
          <p className="mt-6 text-xs text-ink-soft">
            Treatments marked &ldquo;Confirmed at booking&rdquo; are offered on a case-by-case basis. We confirm availability and suitability when you book or at your assessment. Several device-based treatments are not suitable during pregnancy; in pregnancy we focus on gentle hands-on care and exercise.
          </p>
        </div>
      </section>

      <CtaBand title="Not sure which treatment you need?" body="You do not have to choose. Book an assessment and your physiotherapist will recommend a plan." />
    </>
  );
}
