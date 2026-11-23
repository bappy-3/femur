import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqList } from "@/components/sections/faq-list";
import { Bn } from "@/components/ui/bn";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { articleBySlug } from "@/content/articles";
import { conditionBySlug, conditions } from "@/content/conditions";
import { treatmentBySlug } from "@/content/treatments";
import { ArticleCard, TreatmentCard } from "@/features/content/cards";

export const dynamicParams = false;
export const generateStaticParams = () => conditions.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = conditionBySlug(slug);
  return c ? { title: c.name, description: c.summary } : { title: "Condition not found" };
}

export default async function ConditionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = conditionBySlug(slug);
  if (!c) notFound();

  const treatments = c.treatmentSlugs.map(treatmentBySlug).filter((t): t is NonNullable<typeof t> => Boolean(t));
  const articles = c.relatedArticleSlugs.map(articleBySlug).filter((a): a is NonNullable<typeof a> => Boolean(a));
  const faqs = c.faqs.map((f, i) => ({ id: `${c.slug}-${i}`, question: f.q, answer: f.a }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: c.name,
    description: c.summary,
    about: { "@type": "MedicalCondition", name: c.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="border-b border-line bg-mist/70">
        <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="animate-fade-up">
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-soft">
              <Link href={routes.conditions} className="hover:text-teal">Conditions</Link> <span aria-hidden>/</span> <span className="text-ink">{c.name}</span>
            </nav>
            <p className="mb-3 text-sm font-semibold text-sage">{c.group}</p>
            <h1 className="text-[2.3rem] leading-[1.05] font-medium text-teal-deep sm:text-[3.1rem]">{c.name}</h1>
            <Bn className="mt-2 block text-xl text-sage">{c.bn}</Bn>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">{c.overview}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={routes.bookingFor(c.serviceSlug)} size="lg">Book an assessment <ArrowRight className="size-4" /></ButtonLink>
              <ButtonLink href={routes.service(c.serviceSlug)} variant="secondary" size="lg">About the service</ButtonLink>
            </div>
          </div>
          <div className="relative aspect-[4/3.4] overflow-hidden rounded-[1.75rem] bg-white">
            <Image src={c.image.src} alt={c.image.alt} fill priority sizes="(min-width: 1024px) 520px, 92vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {[
            { title: "Common signs", items: c.symptoms },
            { title: "Common causes", items: c.commonCauses },
            { title: "How we approach it", items: c.approach },
          ].map((l, i) => (
            <div key={l.title} data-reveal className="rounded-[var(--radius-card)] border border-line bg-white p-6">
              <p className="font-display text-sm text-sand-deep">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-sans text-lg font-semibold tracking-normal text-ink">{l.title}</h2>
              <ul className="mt-4 space-y-3 text-[0.95rem]">
                {l.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-ink-soft">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-sage" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="container-page mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div data-reveal className="rounded-[var(--radius-card)] border border-rose/30 bg-rose-soft p-6">
            <h2 className="flex items-center gap-2 font-sans text-lg font-semibold tracking-normal text-ink">
              <AlertTriangle className="size-5 text-rose" /> See a doctor first if you have
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.95rem] text-ink">
              {c.seeDoctorIf.map((item) => (
                <li key={item} className="flex gap-2.5"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-rose" /> {item}</li>
              ))}
            </ul>
          </div>
          <div data-reveal className="rounded-[var(--radius-card)] bg-teal-deep p-6 text-white">
            <p className="text-xs font-semibold tracking-[0.14em] text-mint uppercase">বাংলায় সংক্ষেপে</p>
            <Bn className="mt-3 block text-[1.05rem] text-white/90">{c.bnSummary}</Bn>
            <ButtonLink href={routes.bookingFor(c.serviceSlug)} variant="accent" className="mt-6">অ্যাপয়েন্টমেন্ট নিন / Book</ButtonLink>
          </div>
        </div>
      </section>

      {treatments.length > 0 && (
        <section className="border-t border-line bg-white py-16 sm:py-20">
          <div className="container-page">
            <h2 className="text-[1.9rem] font-medium text-teal-deep">Treatments we may use</h2>
            <p className="mt-2 mb-8 max-w-2xl text-ink-soft">Your physiotherapist chooses from these after assessment. Most plans combine hands-on care with exercise.</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {treatments.map((t) => <TreatmentCard key={t.slug} treatment={t} />)}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-page max-w-3xl">
            <h2 className="mb-6 text-[1.9rem] font-medium text-teal-deep">Common questions</h2>
            <FaqList items={faqs} />
            <p className="mt-6 text-xs text-ink-soft">This information is general and does not replace medical advice. Your physiotherapist will advise what is appropriate for you after assessment.</p>
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="border-t border-line bg-white py-16 sm:py-20">
          <div className="container-page">
            <h2 className="mb-8 text-[1.9rem] font-medium text-teal-deep">Read more</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => <ArticleCard key={a.slug} article={a} />)}
            </div>
          </div>
        </section>
      )}

      <div className="pt-20">
        <CtaBand title={`Ready to get help with ${c.name.toLowerCase()}?`} body="Choose a time that suits you. Only genuinely available slots are shown." />
      </div>
    </>
  );
}
