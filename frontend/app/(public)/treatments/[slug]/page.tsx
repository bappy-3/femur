import { AlertTriangle, ArrowRight, CheckCircle2, Clock, Layers, Waves } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqList } from "@/components/sections/faq-list";
import { Bn } from "@/components/ui/bn";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { conditionBySlug } from "@/content/conditions";
import { treatmentBySlug, treatments } from "@/content/treatments";
import { ConditionCard } from "@/features/content/cards";

export const dynamicParams = false;
export const generateStaticParams = () => treatments.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  return t ? { title: t.name, description: t.summary } : { title: "Treatment not found" };
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = treatmentBySlug(slug);
  if (!t) notFound();

  const conditions = t.conditionSlugs.map(conditionBySlug).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const faqs = t.faqs.map((f, i) => ({ id: `${t.slug}-${i}`, question: f.q, answer: f.a }));
  const facts = [
    { icon: Clock, label: "Session", value: t.sessionLength },
    { icon: Layers, label: "Typical course", value: t.typicalCourse },
    { icon: Waves, label: "What it feels like", value: t.sensation },
  ];

  return (
    <>
      <section className="border-b border-line bg-mist/70">
        <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="animate-fade-up">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
              <Link href={routes.treatments} className="hover:text-teal">Treatments</Link> <span aria-hidden>/</span> <span className="text-ink">{t.name}</span>
            </nav>
            <p className="mb-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-teal">{t.family}</p>
            <h1 className="text-[2.3rem] leading-[1.05] font-medium text-teal-deep sm:text-[3.1rem]">{t.name}</h1>
            <Bn className="mt-2 block text-xl text-sage">{t.bn}</Bn>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{t.overview}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={routes.bookingFor(t.serviceSlug)} size="lg">Book an assessment <ArrowRight className="size-4" /></ButtonLink>
              <ButtonLink href={routes.treatments} variant="secondary" size="lg">All treatments</ButtonLink>
            </div>
            {t.availability === "confirm" && <p className="mt-4 text-sm font-medium text-sand-deep">Availability and suitability are confirmed when you book.</p>}
          </div>
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-[1.75rem] bg-white">
            <Image src={t.image.src} alt={t.image.alt} fill priority sizes="(min-width: 1024px) 520px, 92vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} data-reveal className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <span className="grid size-10 place-items-center rounded-xl bg-mint-soft text-teal"><f.icon className="size-5" /></span>
              <p className="mt-4 text-xs font-semibold tracking-wide text-ink-soft uppercase">{f.label}</p>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink">{f.value}</p>
            </div>
          ))}
        </div>

        <div className="container-page mt-5 grid gap-5 lg:grid-cols-2">
          <div data-reveal className="rounded-[var(--radius-card)] border border-line bg-white p-6">
            <h2 className="font-sans text-lg font-semibold tracking-normal text-ink">How it works</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{t.howItWorks}</p>
            <h3 className="mt-6 font-sans text-base font-semibold tracking-normal text-ink">Often used for</h3>
            <ul className="mt-3 space-y-2.5 text-[0.95rem]">
              {t.goodFor.map((g) => (
                <li key={g} className="flex gap-2.5 text-ink-soft"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sage" /> {g}</li>
              ))}
            </ul>
          </div>
          <div data-reveal className="rounded-[var(--radius-card)] border border-rose/30 bg-rose-soft p-6">
            <h2 className="flex items-center gap-2 font-sans text-lg font-semibold tracking-normal text-ink">
              <AlertTriangle className="size-5 text-rose" /> Tell us first if
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.95rem] text-ink">
              {t.tellUsFirst.map((g) => (
                <li key={g} className="flex gap-2.5"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-rose" /> {g}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink-soft">We screen for these at every assessment. Treatment is never given without checking it is suitable for you.</p>
            <p className="mt-5 rounded-xl bg-white/70 p-4 text-sm text-ink-soft"><Bn>{t.bnSummary}</Bn></p>
          </div>
        </div>
      </section>

      {conditions.length > 0 && (
        <section className="border-t border-line bg-white py-16 sm:py-20">
          <div className="container-page">
            <h2 className="mb-8 text-[1.9rem] font-medium text-teal-deep">Conditions it may help with</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {conditions.slice(0, 6).map((c) => <ConditionCard key={c.slug} condition={c} className="h-full" />)}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-page max-w-3xl">
            <h2 className="mb-6 text-[1.9rem] font-medium text-teal-deep">Common questions</h2>
            <FaqList items={faqs} />
            <p className="mt-6 text-xs text-ink-soft">This information is general. Results vary between people, and your clinician will advise what is appropriate for you.</p>
          </div>
        </section>
      )}

      <CtaBand title={`Interested in ${t.name.toLowerCase()}?`} body="Book an assessment and we will tell you honestly whether it is right for you." />
    </>
  );
}
