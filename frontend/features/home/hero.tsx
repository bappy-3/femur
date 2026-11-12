import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import type { HeroContent } from "@/types/cms";

/** Full-bleed, light photographic hero. A soft cream wash keeps the dark text crisp over the photo. */
export function Hero({ content }: { content: HeroContent }) {
  const [first, ...rest] = content.headline.split(" ");
  return (
    <section className="relative isolate overflow-hidden bg-cream">
      <Image src={content.image.src} alt={content.image.alt} fill priority sizes="100vw" className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-cream/45 via-cream/25 to-cream/60" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(245_245_242/0.75),transparent_60%)]" />
      <div className="container-page flex min-h-[34rem] flex-col items-center justify-center py-24 text-center sm:min-h-[40rem] lg:min-h-[44rem]">
        <h1 className="animate-fade-up text-[3.4rem] leading-[0.98] font-medium tracking-[-0.03em] text-teal-deep sm:text-[5.2rem] lg:text-[6.5rem]">
          {first} <em className="font-normal text-sage italic [font-variation-settings:'SOFT'_100]">{rest.join(" ")}</em>
        </h1>
        <p className="mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed font-medium text-ink [animation-delay:80ms] sm:text-xl">{content.subheadline}</p>
        <div className="mt-10 flex animate-fade-up flex-wrap items-center justify-center gap-3 [animation-delay:160ms]">
          <ButtonLink href={routes.booking} variant="accent" size="lg">
            {content.primaryCta} <ArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href={routes.services} variant="primary" size="lg">
            {content.secondaryCta}
          </ButtonLink>
          <ButtonAnchor href={routes.nira} variant="secondary" size="lg" className="bg-white/80">
            <Sparkles className="size-4 text-sand-deep" /> Ask Nira
          </ButtonAnchor>
        </div>
      </div>
    </section>
  );
}
