import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Alert } from "@/components/ui/feedback";
import { PlaceholderMark } from "@/components/ui/placeholder";
import { api } from "@/services";

export const revalidate = 300;
export const metadata: Metadata = { title: "Our Story" };

export default async function OurStoryPage() {
  const about = await api.cms.getAbout();
  const blocks = [about.story, about.mission, about.vision, about.philosophy];
  return (
    <>
      <PageHero eyebrow="Our story" title="How Femur came to be" />
      <section className="py-16 sm:py-20">
        <div className="container-page max-w-3xl">
          {about.story.isPlaceholder && (
            <Alert tone="warning" title="Story pending" className="mb-10">
              Femur&apos;s founding story has not been provided yet. It will be written with the clinic and published from Admin › Website CMS. We have deliberately not invented any history, dates or milestones.
            </Alert>
          )}
          <div className="space-y-12">
            {blocks.map((b) => (
              <article key={b.key} data-reveal>
                <h2 className="flex items-center gap-3 text-[1.9rem] font-medium text-teal-deep">
                  {b.title} {b.isPlaceholder && <PlaceholderMark />}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-ink-soft">{b.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand title="Be part of the next chapter" body="Start your recovery with Femur today." />
    </>
  );
}
