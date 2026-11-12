import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { brandImagery } from "@/config/brand";
import { routes } from "@/config/site";

export function CtaBand({ title, body }: { title: string; body: string }) {
  return (
    <section className="container-page" data-reveal>
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-teal-deep px-6 py-16 text-white sm:px-14 sm:py-20">
        <Image src={brandImagery.cta} alt="" fill sizes="(min-width: 1280px) 1216px, 100vw" className="-z-20 object-cover" loading="lazy" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-deep/90 via-teal-deep/75 to-teal-deep/45" />
        <div className="relative max-w-2xl">
          <h2 className="text-[2rem] leading-tight font-medium sm:text-[2.6rem]">{title}</h2>
          <p className="mt-4 text-lg text-white/80">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={routes.booking} variant="accent" size="lg">
              Book an Appointment <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonAnchor href={routes.nira} variant="inverse" size="lg" className="bg-white/10 text-white hover:bg-white/20">
              <Sparkles className="size-4" /> Ask Nira
            </ButtonAnchor>
          </div>
        </div>
      </div>
    </section>
  );
}
