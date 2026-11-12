import { ArrowRight, CalendarCheck2, ShieldCheck, Sparkles } from "lucide-react";
import Image from "next/image";
import { MotionArc } from "@/components/sections/page-hero";
import { ButtonLink } from "@/components/ui/button";
import { env } from "@/config/env";
import { routes } from "@/config/site";
import type { HeroContent } from "@/types/cms";

/** Splits "Move Better. Live Better." so the repeated word can be styled as the brand accent. */
function Headline({ text }: { text: string }) {
  const sentences = text.split(/(?<=\.)\s+/);
  return (
    <h1 className="text-[3rem] leading-[0.98] font-medium tracking-[-0.03em] text-teal-deep sm:text-[4.4rem] lg:text-[5.2rem]">
      {sentences.map((s, i) => {
        const [first, ...rest] = s.split(" ");
        return (
          <span key={i} className="block">
            {first} {rest.length > 0 && <em className="font-normal text-sage italic [font-variation-settings:'SOFT'_100]">{rest.join(" ")}</em>}
          </span>
        );
      })}
    </h1>
  );
}

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative overflow-hidden bg-grain">
      <MotionArc className="pointer-events-none absolute top-10 -left-40 hidden w-[36rem] text-sage/15 lg:block" />
      <div className="container-page relative grid items-center gap-12 pt-10 pb-16 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-16 lg:pb-24">
        <div className="animate-fade-up">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-teal">
            <span className="size-1.5 rounded-full bg-mint" /> {content.eyebrow}
          </p>
          <Headline text={content.headline} />
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-[1.2rem]">{content.subheadline}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href={routes.booking} size="lg">
              {content.primaryCta} <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href={routes.services} variant="secondary" size="lg">
              {content.secondaryCta}
            </ButtonLink>
          </div>
          <a
            href={env.niraUrl}
            className="group mt-6 inline-flex items-center gap-3 rounded-2xl border border-sand/50 bg-sand-soft/60 py-2 pr-4 pl-2 text-sm transition-colors hover:border-sand hover:bg-sand-soft"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-sand text-teal-deep">
              <Sparkles className="size-4" />
            </span>
            <span>
              <span className="block font-semibold text-teal-deep">Ask Nira</span>
              <span className="block text-xs text-ink-soft">Femur&apos;s AI wellness assistant for members</span>
            </span>
            <ArrowRight className="size-4 text-sand-deep transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-mist sm:aspect-[5/5.4]">
            <Image src={content.image.src} alt={content.image.alt} fill priority sizes="(min-width: 1024px) 560px, 92vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-teal-deep/35 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 -left-3 hidden w-44 overflow-hidden rounded-2xl border-4 border-cream shadow-[var(--shadow-lift)] sm:block lg:-left-10 lg:w-52">
            <div className="relative aspect-[4/3]">
              <Image src={content.secondaryImage.src} alt={content.secondaryImage.alt} fill sizes="208px" className="object-cover" loading="lazy" />
            </div>
          </div>
          <div className="absolute top-5 -right-2 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-[var(--shadow-soft)] sm:-right-5">
            <span className="grid size-9 place-items-center rounded-full bg-mint-soft text-[#3d6e5c]">
              <ShieldCheck className="size-5" />
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold text-ink">Same-gender care</span>
              <span className="text-xs text-ink-soft">for every physio session</span>
            </span>
          </div>
          <div className="absolute right-4 bottom-5 flex items-center gap-3 rounded-2xl bg-teal-deep/90 px-4 py-3 text-white backdrop-blur sm:right-6">
            <CalendarCheck2 className="size-5 text-sand" />
            <span className="text-sm leading-tight">
              <span className="block font-semibold">Book online in ~1 minute</span>
              <span className="text-xs text-white/70">Real-time availability</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
