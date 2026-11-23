import { ArrowLeft, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { Bn } from "@/components/ui/bn";
import { ButtonLink } from "@/components/ui/button";
import { env } from "@/config/env";
import { routes } from "@/config/site";
import { articleBySlug, articles } from "@/content/articles";
import { conditionBySlug } from "@/content/conditions";
import { ArticleCard, formatArticleDate } from "@/features/content/cards";

export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articleBySlug(slug);
  return a ? { title: a.title, description: a.excerpt, openGraph: { type: "article", publishedTime: a.publishedOn } } : { title: "Article not found" };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articleBySlug(slug);
  if (!a) notFound();

  const more = articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const conditions = a.conditionSlugs.map(conditionBySlug).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    datePublished: a.publishedOn,
    image: a.image.src,
    author: { "@type": "Organization", name: "Femur Clinical Team" },
    mainEntityOfPage: `${env.siteUrl}${routes.article(a.slug)}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article>
        <header className="border-b border-line bg-mist/70">
          <div className="container-page max-w-4xl py-12 sm:py-16">
            <Link href={routes.blog} className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-teal">
              <ArrowLeft className="size-4" /> All articles
            </Link>
            <p className="text-xs font-semibold tracking-wide text-sage uppercase">{a.category}</p>
            <h1 className="mt-3 animate-fade-up text-[2.2rem] leading-[1.08] font-medium text-teal-deep sm:text-[3rem]">{a.title}</h1>
            <Bn className="mt-3 block text-lg text-ink-soft">{a.bnTitle}</Bn>
            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
              <span>By the Femur clinical team</span>
              <span aria-hidden>·</span>
              <time dateTime={a.publishedOn}>{formatArticleDate(a.publishedOn)}</time>
              <span aria-hidden>·</span>
              <span className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {a.readMinutes} min read</span>
            </p>
          </div>
        </header>

        <div className="container-page max-w-4xl py-10 sm:py-14">
          <div className="relative aspect-[16/8] overflow-hidden rounded-[1.5rem] bg-mist">
            <Image src={a.image.src} alt={a.image.alt} fill priority sizes="(min-width: 1024px) 896px, 92vw" className="object-cover" />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_16rem]">
            <div className="max-w-[44rem]">
              <p className="text-xl leading-relaxed text-ink">{a.intro}</p>
              {a.sections.map((s) => (
                <section key={s.heading} className="mt-9">
                  <h2 className="text-[1.6rem] font-medium text-teal-deep">{s.heading}</h2>
                  {s.paragraphs.map((p) => <p key={p} className="mt-3 text-[1.05rem] leading-[1.75] text-ink-soft">{p}</p>)}
                  {s.bullets && (
                    <ul className="mt-4 space-y-2.5 text-[1.02rem] text-ink-soft">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex gap-3"><span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sage" /> {b}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <p className="mt-10 rounded-xl border border-line bg-white p-4 text-sm text-ink-soft">
                This article is general information, not medical advice. If you are worried about your symptoms, please speak to a doctor or book an assessment.
              </p>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[var(--radius-card)] bg-teal-deep p-5 text-white">
                <p className="text-xs font-semibold tracking-[0.14em] text-mint uppercase">Key points</p>
                <ul className="mt-3 space-y-2.5 text-sm text-white/85">
                  {a.keyPoints.map((k) => <li key={k} className="flex gap-2.5"><span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-sand" /> {k}</li>)}
                </ul>
              </div>
              {conditions.length > 0 && (
                <div className="rounded-[var(--radius-card)] border border-line bg-white p-5">
                  <p className="text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">Related</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {conditions.map((c) => <li key={c.slug}><Link href={routes.condition(c.slug)} className="font-medium text-teal hover:underline">{c.name}</Link></li>)}
                  </ul>
                </div>
              )}
              <ButtonLink href={routes.booking} className="w-full">Book an assessment</ButtonLink>
            </aside>
          </div>
        </div>
      </article>

      <section className="border-t border-line bg-white py-16 sm:py-20">
        <div className="container-page">
          <h2 className="mb-8 text-[1.9rem] font-medium text-teal-deep">More from the blog</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{more.map((m) => <ArticleCard key={m.slug} article={m} />)}</div>
        </div>
      </section>
      <div className="pt-20"><CtaBand title="Want advice specific to you?" body="An assessment tells us what is driving your pain and what will help most." /></div>
    </>
  );
}
