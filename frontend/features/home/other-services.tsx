import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/sections/section";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { ServiceCard } from "@/features/service-catalog/service-card";
import type { Service } from "@/types/catalog";

/** Core physiotherapy beyond maternal care, shown with the same image-led cards as the services page. */
const SLUGS = ["physiotherapy", "pain-management", "orthopedic-rehabilitation", "sports-injury-rehabilitation", "neurological-rehabilitation", "posture-correction"];

export function OtherServices({ services }: { services: Service[] }) {
  const items = SLUGS.map((slug) => services.find((s) => s.slug === slug)).filter((s): s is Service => Boolean(s));
  if (items.length === 0) return null;
  return (
    <Section>
      <div className="container-page">
        <SectionHeading
          eyebrow="Physiotherapy for everyone"
          title="Complete care for every body"
          intro="Beyond maternal care, Femur treats pain, injury, joint and nerve conditions for women, men and families, with same-gender physiotherapists."
          action={
            <ButtonLink href={routes.services} variant="secondary">
              All services <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </Section>
  );
}
