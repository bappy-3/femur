import { Lock, MessageSquareHeart, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { brandImagery } from "@/config/brand";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/sections/section";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { env } from "@/config/env";
import { routes } from "@/config/site";
import { getSession } from "@/services/session";

export const metadata: Metadata = {
  title: "Nira — Members' Consultant",
  description: "Nira is Femur's consultant for members. Log in with an active membership to use it.",
};

export const dynamic = "force-dynamic";

export default async function NiraGatePage() {
  const user = await getSession();
  const isMember = user?.membership.status === "ACTIVE" && user.membership.entitlements["nira.access"] === true;

  return (
    <>
      <PageHero
        image={brandImagery.nira}
        eyebrow="Members only"
        title={
          <>
            Meet <em className="text-mint italic">Nira</em>
          </>
        }
        intro="Nira is Femur's consultant for members — guidance on physiotherapy, exercise and recovery between your visits."
      />
      <Section>
        <div className="container-page grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.5rem] border border-line bg-white p-8 sm:p-10">
            {isMember ? (
              <>
                <Sparkles className="size-8 text-sand-deep" />
                <h2 className="mt-4 text-3xl font-medium text-teal-deep">Welcome back, {user!.fullName.split(" ")[0]}</h2>
                <p className="mt-3 text-ink-soft">Your {user!.membership.planName} membership is active. You can use Nira now.</p>
                <ButtonAnchor href={env.niraUrl} variant="accent" size="lg" className="mt-8">
                  <Sparkles className="size-4" /> Open Nira
                </ButtonAnchor>
              </>
            ) : user ? (
              <>
                <Lock className="size-8 text-sage" />
                <h2 className="mt-4 text-3xl font-medium text-teal-deep">An active membership is required</h2>
                <p className="mt-3 text-ink-soft">
                  You&apos;re signed in as {user.fullName}, but there&apos;s no active membership on your account
                  {user.membership.status === "PENDING_PAYMENT" ? " yet — we're waiting to confirm your payment." : "."}
                </p>
                <ButtonLink href={routes.account.membership} size="lg" className="mt-8">
                  {user.membership.status === "PENDING_PAYMENT" ? "View membership status" : "Become a member"}
                </ButtonLink>
              </>
            ) : (
              <>
                <Lock className="size-8 text-sage" />
                <h2 className="mt-4 text-3xl font-medium text-teal-deep">Log in to use Nira</h2>
                <p className="mt-3 text-ink-soft">Nira is available to Femur members. Please log in to your account — if you&apos;re not a member yet, you can join in a few minutes.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={`${routes.login}?next=${routes.nira}`} size="lg">
                    Log in
                  </ButtonLink>
                  <ButtonLink href={routes.membership} variant="secondary" size="lg">
                    Become a member
                  </ButtonLink>
                </div>
              </>
            )}
          </div>
          <div className="relative isolate overflow-hidden rounded-[1.5rem] bg-teal-deep p-8 text-white sm:p-10">
            <Image src={brandImagery.panel} alt="" fill sizes="(min-width: 1024px) 480px, 92vw" className="-z-20 object-cover" loading="lazy" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-teal-deep/80" />
            <h3 className="text-2xl font-medium">What you can ask</h3>
            <ul className="mt-5 space-y-3">
              {["How should I prepare for my first physiotherapy session?", "What exercises are suitable for desk-related neck pain?", "What does a frozen shoulder mean?", "How long does recovery after a knee replacement usually take?"].map((q) => (
                <li key={q} className="flex gap-2.5 rounded-xl bg-white/[0.07] px-3.5 py-2.5 text-sm text-white/90">
                  <MessageSquareHeart className="mt-0.5 size-4 shrink-0 text-mint" /> {q}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-white/55">Nira offers general guidance and does not replace your treating clinician. In an emergency, seek medical help immediately.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
