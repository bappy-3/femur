import type { Metadata } from "next";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { DemoNotice } from "@/components/ui/placeholder";
import { PlanCard } from "@/features/pricing/plan-card";
import { PriceTables } from "@/features/pricing/price-table";
import { api } from "@/services";

export const revalidate = 300;
export const metadata: Metadata = { title: "Pricing", description: "Session fees, treatment packages, consultation fees and membership plans." };

export default async function PricingPage() {
  const [items, plans] = await Promise.all([api.pricing.listPriceItems(), api.pricing.listPlans()]);
  return (
    <>
      <PageHero eyebrow="Pricing" title="Clear pricing, no surprises" intro="Pay per session, save with a treatment package, or become a member for ongoing support. Payment at the clinic is always available." />
      <Section>
        <div className="container-page">
          <DemoNotice className="mb-8" />
          <PriceTables items={items} />
        </div>
      </Section>
      <Section tone="mist">
        <div className="container-page">
          <SectionHeading eyebrow="Membership" title="Membership plans" intro="Optional. A free account is enough to book; membership adds member pricing, priority booking and Nira." align="center" />
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        </div>
      </Section>
      <div className="pt-20">
        <CtaBand title="Questions about fees?" body="Call or WhatsApp the clinic, or book an assessment and we'll walk you through the options." />
      </div>
    </>
  );
}
