import { Section, SectionHeading } from "@/components/sections/section";
import { ConsultancyCard } from "@/features/service-catalog/service-card";
import type { Service } from "@/types/catalog";

export function ConsultancySection({ services }: { services: Service[] }) {
  if (services.length === 0) return null;
  return (
    <Section tone="white" className="border-y border-line">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          index="07"
          eyebrow="Additional consultancy"
          title="Visiting specialists, on scheduled days"
          intro="Alongside physiotherapy, visiting consultants hold sessions at Femur on set days. Booking only shows days they are actually here."
          className="mb-0 md:items-start"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <ConsultancyCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </Section>
  );
}
