import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/sections/section";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { ServiceCard } from "@/features/service-catalog/service-card";
import type { Service } from "@/types/catalog";

export function CoreServices({ services }: { services: Service[] }) {
  const featured = services.filter((s) => s.isFeatured).slice(0, 6);
  return (
    <Section>
      <div className="container-page">
        <SectionHeading
          index="01"
          eyebrow="Physiotherapy services"
          title={
            <>
              Rehabilitation is what <em className="not-italic">we do best</em>
            </>
          }
          intro="Assessment-led physiotherapy for pain, injury, surgery recovery and long-term conditions — delivered by male and female physiotherapists."
          action={
            <ButtonLink href={routes.services} variant="secondary">
              All services <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </Section>
  );
}
