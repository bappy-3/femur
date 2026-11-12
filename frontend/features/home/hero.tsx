import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { env } from "@/config/env";
import { routes } from "@/config/site";
import type { HeroContent } from "@/types/cms";

/** Full-bleed photographic hero. Text is centred over a teal scrim for legibility. */
export function Hero({ content }: { content: HeroContent }) {
  const [first, ...rest] = content.headline.split(" ");
  return (
    <section className="relative isolate overflow-hidden bg-teal-deep">
      <Image src={content.image.src} alt={content.image.alt} fill priority sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-teal-deep/70 via-teal-deep/55 to-teal-deep/75" />
      <div className="container-page flex min-h-[34rem] flex-col items-center justify-center py-24 text-center sm:min-h-[40rem] lg:min-h-[44rem]">
        <h1 className="animate-fade-up text-[3.4rem] leading-[0.98] font-medium tracking-[-0.03em] text-white sm:text-[5.2rem] lg:text-[6.5rem]">
          {first} <em className="font-normal text-mint italic [font-variation-settings:'SOFT'_100]">{rest.join(" ")}</em>
        </h1>
        <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/90 [animation-delay:80ms] sm:text-xl">{content.subheadline}</p>
        <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-3 [animation-delay:160ms]">
          <ButtonLink href={routes.booking} variant="accent" size="lg">
            {content.primaryCta} <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href={routes.services} variant="inverse" size="lg">
            {content.secondaryCta}
          </ButtonLink>
          <ButtonAnchor href={env.niraUrl} variant="secondary" size="lg" className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white">
            <Sparkles className="size-4 text-sand" /> Ask Nira
          </ButtonAnchor>
        </div>
      </div>
    </section>
  );
}
