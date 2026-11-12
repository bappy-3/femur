import type { Metadata } from "next";
import { brandImagery } from "@/config/brand";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { ButtonLink } from "@/components/ui/button";
import { DemoNotice } from "@/components/ui/placeholder";
import { routes } from "@/config/site";
import { PractitionerCard } from "@/features/practitioners/practitioner-card";
import { api } from "@/services";

export const revalidate = 300;
export const metadata: Metadata = { title: "Our Specialists", description: "Meet Femur's physiotherapists and visiting consultants." };

export default async function SpecialistsPage() {
  const [practitioners, services] = await Promise.all([api.practitioners.list(), api.catalog.listServices()]);
  const names = (ids: string[]) => ids.map((id) => services.find((s) => s.id === id)?.name).filter((n): n is string => Boolean(n));
  const resident = practitioners.filter((p) => !p.isVisiting);
  const visiting = practitioners.filter((p) => p.isVisiting);

  return (
    <>
      <PageHero
        image={brandImagery.specialists}
        eyebrow="Our team"
        title="Specialists who take the time to understand you"
        intro="Male patients are treated by male physiotherapists and female patients by female physiotherapists. Visiting consultants hold sessions on scheduled days."
      >
        <ButtonLink href={routes.booking} variant="accent">Book an appointment</ButtonLink>
      </PageHero>
      <Section>
        <div className="container-page">
          <DemoNotice className="mb-8">Names, photos and credentials are placeholders. Femur will add verified practitioner profiles from the admin portal.</DemoNotice>
          <SectionHeading index="01" eyebrow="Physiotherapists" title="Our physiotherapy team" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resident.map((p) => (
              <PractitionerCard key={p.id} practitioner={p} serviceNames={names(p.serviceIds)} />
            ))}
          </div>
        </div>
      </Section>
      <Section tone="white" className="border-t border-line">
        <div className="container-page">
          <SectionHeading index="02" eyebrow="Visiting consultants" title="Consultancy specialists" intro="Available on their scheduled visiting days only." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visiting.map((p) => (
              <PractitionerCard key={p.id} practitioner={p} serviceNames={names(p.serviceIds)} />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
