import { AlertTriangle, ArrowRight, CheckCircle2, Heart, Lock, ShieldCheck, Stethoscope } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqList } from "@/components/sections/faq-list";
import { PageHero } from "@/components/sections/page-hero";
import { Bn } from "@/components/ui/bn";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { conditionBySlug } from "@/content/conditions";
import { maternalFaqs, maternalFirstVisit, maternalPromises, maternalStages, maternalWarningSigns } from "@/content/maternal";
import { stock } from "@/services/mock/fixtures/images";

export const metadata: Metadata = {
  title: "Maternal care: pre-pregnancy, pregnancy & postnatal physiotherapy",
  description: "Physiotherapy for every stage of motherhood in Uttara, Dhaka: preparing for pregnancy, pregnancy back and pelvic pain, C-section and postnatal recovery, pelvic floor therapy. Female physiotherapists only.",
};

const promiseIcons = [Heart, Stethoscope, ShieldCheck, Lock];

export default function MaternalCarePage() {
  const faqs = maternalFaqs.map((f, i) => ({ id: `m-${i}`, question: f.q, answer: f.a }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: maternalFaqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow="Maternal care"
        title={<>Care for every stage of motherhood <Bn className="mt-3 block text-[0.5em] font-medium text-sage">মাতৃত্বের প্রতিটি ধাপে পাশে</Bn></>}
        intro="Before you conceive, while you are pregnant and after your baby arrives, our female physiotherapists help you feel strong, comfortable and confident."
        image={stock.pregnancy.src}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={routes.bookingFor("pregnancy-rehabilitation")} size="lg">Book an appointment <ArrowRight className="size-4" /></ButtonLink>
          <ButtonLink href="#stages" variant="secondary" size="lg">Choose your stage</ButtonLink>
        </div>
      </PageHero>

      <section className="border-b border-line bg-white py-10">
        <ul className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {maternalPromises.map((p, i) => {
            const Icon = promiseIcons[i % promiseIcons.length]!;
            return (
              <li key={p.title} className="flex gap-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint-soft text-teal"><Icon aria-hidden className="size-5" /></span>
                <span>
                  <strong className="block text-[0.95rem] text-ink">{p.title}</strong>
                  <span className="mt-0.5 block text-sm leading-relaxed text-ink-soft">{p.body}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <div id="stages" className="scroll-mt-24">
        {maternalStages.map((s, i) => {
          const conditions = s.conditionSlugs.map(conditionBySlug).filter((c): c is NonNullable<typeof c> => Boolean(c));
          return (
            <section key={s.id} id={s.id} className={`scroll-mt-24 py-16 sm:py-20 ${i % 2 ? "bg-mist/60" : ""}`}>
              <div className={`container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
                <div className="relative aspect-[4/3.2] overflow-hidden rounded-[1.75rem] bg-mint-soft">
                  <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
                </div>
                <div data-reveal>
                  <p className="font-display text-sm text-sand-deep">{String(i + 1).padStart(2, "0")} · Stage</p>
                  <h2 className="mt-2 text-[2rem] leading-tight font-medium text-teal-deep sm:text-[2.5rem]">{s.name}</h2>
                  <Bn className="block text-lg text-sage">{s.bn}</Bn>
                  <p className="mt-4 text-lg leading-relaxed text-ink-soft">{s.tagline}</p>
                  <ul className="mt-5 space-y-2.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-ink-soft"><CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-sage" /> {p}</li>
                    ))}
                  </ul>
                  {conditions.length > 0 && (
                    <p className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-ink-soft">Common concerns:</span>
                      {conditions.map((c) => (
                        <Link key={c.slug} href={routes.condition(c.slug)} className="rounded-full bg-white px-3 py-1 font-medium text-teal ring-1 ring-line hover:bg-mint-soft">{c.name}</Link>
                      ))}
                    </p>
                  )}
                  <div className="mt-7 flex flex-wrap gap-3">
                    <ButtonLink href={routes.bookingFor(s.serviceSlug)}>{s.cta} <ArrowRight className="size-4" /></ButtonLink>
                    <ButtonLink href={routes.service(s.serviceSlug)} variant="ghost">Learn more</ButtonLink>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="border-t border-line bg-white py-16 sm:py-20">
        <div className="container-page">
          <h2 className="text-[1.9rem] font-medium text-teal-deep">Your first visit</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {maternalFirstVisit.map((s, i) => (
              <li key={s.title} data-reveal className="rounded-[var(--radius-card)] border border-line bg-cream p-5">
                <span className="font-display text-sm text-sand-deep">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 font-sans text-base font-semibold tracking-normal text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="mb-6 text-[1.9rem] font-medium text-teal-deep">Common questions</h2>
            <FaqList items={faqs} />
          </div>
          <aside className="h-fit rounded-[var(--radius-card)] border border-rose/30 bg-rose-soft p-6">
            <h2 className="flex items-center gap-2 font-sans text-lg font-semibold tracking-normal text-ink">
              <AlertTriangle aria-hidden className="size-5 text-rose" /> Call your doctor or midwife first if you have
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.95rem] text-ink">
              {maternalWarningSigns.map((w) => (
                <li key={w} className="flex gap-2.5"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-rose" /> {w}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-ink-soft">In an emergency, go to the nearest hospital. Physiotherapy does not replace obstetric care.</p>
          </aside>
        </div>
      </section>

      <CtaBand title="You and your baby deserve to feel well" body="Book a private appointment with a female physiotherapist. It takes about a minute." />
    </>
  );
}
