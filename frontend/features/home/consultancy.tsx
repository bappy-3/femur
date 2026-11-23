import { Section, SectionHeading } from "@/components/sections/section";
import { ConsultancyCard } from "@/features/service-catalog/service-card";
import type { Service } from "@/types/catalog";

export function ConsultancySection({ services }: { services: Service[] }) {
  if (services.length === 0) return null;
  return (
    <Section tone="mist">
      <div className="container-page grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          index="07"
          eyebrow="Visiting specialists"
          title="Nutrition, medicine, eye and dental care under one roof"
          intro="Alongside physiotherapy, visiting consultants hold sessions at Femur on set days. Nutrition advice is especially helpful through pregnancy and recovery."
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
