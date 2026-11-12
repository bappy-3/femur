import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqList } from "@/components/sections/faq-list";
import { brandImagery } from "@/config/brand";
import { PageHero } from "@/components/sections/page-hero";
import { api } from "@/services";

export const revalidate = 300;
export const metadata: Metadata = { title: "Frequently Asked Questions" };

export default async function FaqPage() {
  const faqs = await api.cms.listFaqs();
  const categories = [...new Set(faqs.map((f) => f.category))];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
  };
  return (
    <>
      <PageHero image={brandImagery.contact} eyebrow="Help centre" title="Frequently asked questions" intro="Can't find what you're looking for? Contact the clinic and we'll be happy to help." />
      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[14rem_1fr]">
          <nav aria-label="FAQ categories" className="hidden lg:block">
            <ul className="sticky top-28 space-y-1 text-sm">
              {categories.map((c) => (
                <li key={c}>
                  <a href={`#${c.toLowerCase()}`} className="block rounded-lg px-3 py-2 text-ink-soft hover:bg-mist hover:text-teal">
                    {c}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-10">
            {categories.map((c) => (
              <section key={c} id={c.toLowerCase()} className="scroll-mt-28">
                <h2 className="mb-4 text-2xl font-medium text-teal-deep">{c}</h2>
                <FaqList items={faqs.filter((f) => f.category === c)} />
              </section>
            ))}
          </div>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <CtaBand title="Still have questions?" body="Our team is happy to help you choose the right service." />
    </>
  );
}
