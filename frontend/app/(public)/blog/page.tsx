import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Bn } from "@/components/ui/bn";
import { articles } from "@/content/articles";
import { ArticleCard } from "@/features/content/cards";
import { stock } from "@/services/mock/fixtures/images";

export const metadata: Metadata = {
  title: "Health blog",
  description: "Practical, plain-language guides on back pain, joints, posture, women's health and understanding pain, from the Femur clinical team.",
};

export default function BlogPage() {
  const sorted = [...articles].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
  const [first, ...rest] = sorted;
  return (
    <>
      <PageHero
        eyebrow="Health blog"
        title={<>Understand your pain <Bn className="mt-3 block text-[0.55em] font-medium text-sage">ব্যথা বুঝুন, সুস্থ থাকুন</Bn></>}
        intro="Plain-language guides from our clinical team: what is going on, what helps and when to get checked."
        image={stock.consultation.src}
      />
      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {first && <ArticleCard article={first} featured />}
          {rest.map((a) => <ArticleCard key={a.slug} article={a} />)}
        </div>
        <p className="container-page mt-8 text-xs text-ink-soft">Articles are general information and do not replace professional medical advice.</p>
      </section>
      <CtaBand title="Got a question about your own pain?" body="Book an assessment and get advice that is specific to you." />
    </>
  );
}
