import { ArrowRight, Check, MessageSquareHeart, Sparkles } from "lucide-react";
import Image from "next/image";
import { Section } from "@/components/sections/section";
import { brandImagery } from "@/config/brand";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { formatMoney } from "@/lib/money";
import type { MembershipPlan } from "@/types/membership";

export function MembershipIntro({ plans }: { plans: MembershipPlan[] }) {
  const lead = plans.find((p) => p.isHighlighted) ?? plans[0];
  return (
    <Section>
      <div className="container-page grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div data-reveal className="relative overflow-hidden rounded-[1.75rem] border border-line bg-white p-8 sm:p-12">
          <p className="mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-sage uppercase">
            <span className="font-display text-sm tracking-normal text-sand-deep">06</span>
            <span aria-hidden className="h-px w-8 bg-sage/40" /> Membership
          </p>
          <h2 className="text-[2rem] leading-[1.08] font-medium text-teal-deep sm:text-[2.5rem]">Support that continues between sessions</h2>
          <p className="mt-4 max-w-lg text-[1.05rem] leading-relaxed text-ink-soft">
            A free account lets you book and manage appointments. Membership adds member pricing, priority booking and full access to Nira.
          </p>
          <ul className="mt-6 grid gap-2.5 text-sm sm:grid-cols-2">
            {(lead?.benefits ?? []).map((b) => (
              <li key={b} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-sage" /> {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href={routes.membership}>
              Explore membership <ArrowRight className="size-4" />
            </ButtonLink>
            {lead && <span className="text-sm text-ink-soft">Plans from <strong className="text-teal">{formatMoney(lead.price)}</strong> / month</span>}
          </div>
        </div>
        <div data-reveal className="relative isolate flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-teal-deep p-8 text-white sm:p-10">
          <Image src={brandImagery.panel} alt="" fill sizes="(min-width: 1024px) 520px, 92vw" className="-z-20 object-cover" loading="lazy" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-teal-deep/80" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-sand">
              <Sparkles className="size-3.5" /> Members only
            </span>
            <h3 className="mt-5 text-3xl font-medium">Meet Nira</h3>
            <p className="mt-3 leading-relaxed text-white/75">
              Femur&apos;s consultant for members. Ask about physiotherapy, exercise and recovery, and get help planning your care between visits.
            </p>
            <div className="mt-6 space-y-2.5">
              {["What does a frozen shoulder mean?", "How should I prepare for my first session?"].map((q) => (
                <p key={q} className="flex items-center gap-2.5 rounded-xl bg-white/[0.07] px-3.5 py-2.5 text-sm text-white/85">
                  <MessageSquareHeart className="size-4 shrink-0 text-mint" /> {q}
                </p>
              ))}
            </div>
          </div>
          <div className="relative mt-8">
            <ButtonAnchor href={routes.nira} variant="accent">
              <Sparkles className="size-4" /> Ask Nira
            </ButtonAnchor>
            <p className="mt-3 text-xs text-white/50">Nira provides general information and does not diagnose or replace your clinician.</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
