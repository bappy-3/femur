import { Check, Minus, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { brandImagery } from "@/config/brand";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/sections/section";
import { ButtonAnchor } from "@/components/ui/button";
import { DemoNotice } from "@/components/ui/placeholder";
import { routes } from "@/config/site";
import { PlanCard } from "@/features/pricing/plan-card";
import { api } from "@/services";

export const revalidate = 300;
export const metadata: Metadata = { title: "Membership", description: "Femur membership plans — member pricing, priority booking and access to Nira, our members-only consultant." };

const COMPARISON = [
  { label: "Book & manage appointments", free: true, member: true },
  { label: "Save family member profiles", free: true, member: true },
  { label: "Appointment history & reminders", free: true, member: true },
  { label: "Member pricing on sessions", free: false, member: true },
  { label: "Priority booking window", free: false, member: true },
  { label: "Nira — members-only consultant", free: false, member: true },
];

export default async function MembershipPage() {
  const plans = await api.pricing.listPlans();
  return (
    <>
      <PageHero image={brandImagery.membership} eyebrow="Membership" title="Stay supported between sessions" intro="Registering is free and lets you book. Membership is optional and adds ongoing benefits — including full access to Nira." />
      <Section>
        <div className="container-page">
          <DemoNotice className="mb-8" />
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
        </div>
      </Section>
      <Section tone="white" className="border-y border-line">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Free account vs membership" title="What's included" className="mb-8" />
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs tracking-wide text-ink-soft uppercase">
                  <th className="py-3 font-semibold">Feature</th>
                  <th className="w-24 py-3 text-center font-semibold">Free</th>
                  <th className="w-24 py-3 text-center font-semibold">Member</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((r) => (
                  <tr key={r.label} className="border-b border-line">
                    <td className="py-3.5 text-ink">{r.label}</td>
                    {[r.free, r.member].map((v, i) => (
                      <td key={i} className="text-center">
                        {v ? <Check className="mx-auto size-4 text-sage" aria-label="Included" /> : <Minus className="mx-auto size-4 text-ink/25" aria-label="Not included" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-teal-deep p-8 text-white sm:p-10">
            <Image src={brandImagery.panel} alt="" fill sizes="(min-width: 1024px) 560px, 92vw" className="-z-20 object-cover" loading="lazy" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-teal-deep/80" />
            <Sparkles className="size-8 text-sand" />
            <h2 className="mt-5 text-3xl font-medium">How Nira access works</h2>
            <ul className="mt-6 space-y-3 text-white/80">
              <li>1. Sign in with your Femur account.</li>
              <li>2. Have an active membership that includes Nira.</li>
              <li>3. Open Nira — your membership is checked every time you use it.</li>
            </ul>
            <p className="mt-6 text-sm text-white/55">
              If a membership expires or is suspended, access ends immediately. Nira offers general guidance only and does not replace your treating clinician.
            </p>
            <ButtonAnchor href={routes.nira} variant="accent" className="mt-8">
              Go to Nira
            </ButtonAnchor>
          </div>
        </div>
      </Section>
    </>
  );
}
