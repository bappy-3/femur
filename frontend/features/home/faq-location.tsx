import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ContactDetails, MapEmbed } from "@/components/sections/contact-panel";
import { FaqList } from "@/components/sections/faq-list";
import { Section, SectionHeading } from "@/components/sections/section";
import { routes } from "@/config/site";
import type { Faq, SiteSettings } from "@/types/cms";

export function FaqPreview({ faqs }: { faqs: Faq[] }) {
  return (
    <Section tone="mist">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeading index="09" eyebrow="FAQ" title="Questions, answered" intro="Everything you need to know before your first visit." className="mb-6" />
          <Link href={routes.faq} className="inline-flex items-center gap-2 font-semibold text-teal hover:text-teal-deep">
            See all questions <ArrowRight className="size-4" />
          </Link>
        </div>
        <div data-reveal>
          <FaqList items={faqs.slice(0, 5)} />
        </div>
      </div>
    </Section>
  );
}

export function LocationSection({ settings }: { settings: SiteSettings }) {
  return (
    <Section>
      <div className="container-page">
        <SectionHeading index="10" eyebrow="Visit us" title="Find us in Uttara" intro="Easy to reach, with private treatment rooms and a dedicated exercise area." />
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <ContactDetails settings={settings} />
          <MapEmbed query={settings.contact.mapQuery} />
        </div>
      </div>
    </Section>
  );
}
