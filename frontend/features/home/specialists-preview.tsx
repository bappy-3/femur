import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/sections/section";
import { ButtonLink } from "@/components/ui/button";
import { DemoNotice } from "@/components/ui/placeholder";
import { routes } from "@/config/site";
import { PractitionerCard } from "@/features/practitioners/practitioner-card";
import type { Practitioner } from "@/types/practitioner";

export function SpecialistsPreview({ practitioners }: { practitioners: Practitioner[] }) {
  const physios = practitioners.filter((p) => !p.isVisiting).slice(0, 4);
  return (
    <Section>
      <div className="container-page">
        <SectionHeading
          index="04"
          eyebrow="Meet our specialists"
          title="The people behind your recovery"
          intro="Male and female physiotherapists, supported by visiting consultants on scheduled days."
          action={
            <ButtonLink href={routes.specialists} variant="secondary">
              Meet the team <ArrowRight className="size-4" />
            </ButtonLink>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {physios.map((p) => (
            <PractitionerCard key={p.id} practitioner={p} />
          ))}
        </div>
        <DemoNotice className="mt-6">Practitioner names and credentials are placeholders until Femur provides verified profiles.</DemoNotice>
      </div>
    </Section>
  );
}
