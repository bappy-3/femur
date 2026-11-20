import { ArrowRight, CalendarCheck2, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MotionArc } from "@/components/sections/page-hero";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import type { HeroContent } from "@/types/cms";

const CONCERNS = ["Back & neck pain", "Sports injury", "Post-surgery rehab", "Pregnancy care", "Posture & ergonomics"];

/**
 * Clinical hero. Layout is fixed by aspect ratios and grid tracks (no layout shift while images load),
 * collapses to a single column below `lg`, and never overflows horizontally (`overflow-x-clip`).
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative isolate overflow-x-clip bg-mist">
      <div aria-hidden className="absolute -top-48 -right-40 -z-10 size-[40rem] rounded-full bg-mint-soft/80 sm:size-[52rem]" />
      <div className="container-page grid items-center gap-x-10 gap-y-12 pt-10 pb-8 sm:pt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:pt-20">
        <div className="min-w-0">
          <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-teal/15 bg-white px-3.5 py-1.5 text-sm font-medium text-teal">
            <HeartPulse aria-hidden className="size-4 shrink-0" /> Physiotherapy &amp; wellness clinic, Uttara
          </p>
          <h1 className="mt-5 animate-fade-up text-[clamp(2.75rem,8vw,5.25rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-teal-deep [animation-delay:60ms]">
            {content.headline}
          </h1>
          <p className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-ink-soft [animation-delay:120ms] sm:text-lg">{content.subheadline}</p>
          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:180ms] sm:flex-row sm:flex-wrap sm:items-center">
            <ButtonLink href={routes.booking} size="lg">
              {content.primaryCta} <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href={routes.services} variant="secondary" size="lg">
              {content.secondaryCta}
            </ButtonLink>
            <ButtonAnchor href={routes.nira} variant="ghost" size="lg" className="max-sm:border max-sm:border-teal/15 max-sm:bg-white/60">
              <Sparkles className="size-4 text-sand-deep" /> Ask Nira
            </ButtonAnchor>
          </div>
          <ul className="mt-8 flex animate-fade-up flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft [animation-delay:240ms]">
            {["Assessment-led plans", "Same-gender care", "Instant online booking"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <ShieldCheck aria-hidden className="size-4 shrink-0 text-sage" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-lg animate-fade-up [animation-delay:140ms] lg:max-w-none">
          <MotionArc className="pointer-events-none absolute -top-10 -right-6 -z-10 w-[85%] text-sage/40" />
          <div className="relative ml-auto aspect-[4/4.6] w-[86%] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-mint-soft shadow-lift">
            <Image src={content.image.src} alt={content.image.alt} fill priority sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          {content.secondaryImage && (
            <div className="absolute bottom-6 left-0 aspect-square w-[34%] overflow-hidden rounded-full border-[6px] border-mist bg-mint-soft shadow-lift">
              <Image src={content.secondaryImage.src} alt="" fill sizes="(min-width: 1024px) 14vw, 30vw" className="object-cover" />
            </div>
          )}
          <div className="absolute top-6 right-0 flex max-w-[15rem] items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-lift sm:p-4 lg:-right-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mint-soft text-teal">
              <CalendarCheck2 aria-hidden className="size-5" />
            </span>
            <span className="text-sm leading-tight">
              <strong className="block text-ink">Book in minutes</strong>
              <span className="text-ink-soft">Live availability</span>
            </span>
          </div>
        </div>
      </div>

      <div className="container-page pb-10 sm:pb-14">
        <div className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:gap-5 sm:p-5">
          <p className="shrink-0 text-sm font-semibold text-ink">Looking for care with</p>
          <ul className="flex flex-wrap gap-2">
            {CONCERNS.map((c) => (
              <li key={c}>
                <Link href={routes.services} className="inline-flex rounded-full bg-mist px-3.5 py-1.5 text-sm font-medium text-teal-deep transition-colors hover:bg-mint-soft">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
