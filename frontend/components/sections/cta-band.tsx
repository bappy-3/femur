import { ArrowRight, Sparkles } from "lucide-react";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";

export function CtaBand({ title, body }: { title: string; body: string }) {
  return (
    <section className="container-page" data-reveal>
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-teal-deep px-6 py-16 text-white sm:px-14 sm:py-20">
        <div aria-hidden className="absolute -top-24 -right-24 -z-10 size-[26rem] rounded-full bg-teal/60" />
        <div aria-hidden className="absolute -right-8 -bottom-32 -z-10 size-[22rem] rounded-full bg-sage/30" />
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
