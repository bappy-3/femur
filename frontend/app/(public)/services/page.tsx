import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { brandImagery } from "@/config/brand";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { ConsultancyCard, ServiceCard } from "@/features/service-catalog/service-card";
import { api } from "@/services";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Services",
  description: "Physiotherapy, pain management, sports, orthopedic, neurological, post-operative and pregnancy rehabilitation — plus visiting consultancy.",
};

export default async function ServicesPage() {
  const [physio, consultancy] = await Promise.all([api.catalog.listServices({ kind: "PHYSIOTHERAPY" }), api.catalog.listServices({ kind: "CONSULTANCY" })]);
  return (
    <>
      <PageHero
        image={brandImagery.services}
        eyebrow="Our services"
        title={
          <>
            Physiotherapy at the core, <em className="not-italic">wellness</em> around it
          </>
        }
        intro="Every physiotherapy programme starts with an assessment and a plan you understand. Visiting consultants add nutrition, medical, eye and dental care on scheduled days."
      />
      <Section>
        <div className="container-page">
          <SectionHeading index="01" eyebrow="Physiotherapy & rehabilitation" title="Primary services" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {physio.map((s, i) => (
              <ServiceCard key={s.id} service={s} priority={i < 3} />
            ))}
          </div>
        </div>
      </Section>
      <Section tone="white" className="border-y border-line">
        <div className="container-page">
          <SectionHeading
            index="02"
            eyebrow="Additional consultancy"
            title="Visiting specialists"
            intro="These consultants are not at the clinic every day. Booking shows only their actual visiting days."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {consultancy.map((s) => (
              <ConsultancyCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </Section>
      <div className="pt-20">
        <CtaBand title="Not sure which service you need?" body="Book a physiotherapy assessment — we'll recommend the right path, including any consultancy you may benefit from." />
      </div>
    </>
  );
}
