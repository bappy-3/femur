import { ArrowRight, Sparkles } from "lucide-react";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { env } from "@/config/env";
import { routes } from "@/config/site";
import { MotionArc } from "./page-hero";

export function CtaBand({ title, body }: { title: string; body: string }) {
  return (
    <section className="container-page" data-reveal>
      <div className="relative overflow-hidden rounded-[1.75rem] bg-teal px-6 py-14 text-white sm:px-14 sm:py-16">
        <MotionArc className="pointer-events-none absolute -top-32 -right-28 w-[30rem] text-white/10" />
        <div className="relative max-w-2xl">
          <h2 className="text-[2rem] leading-tight font-medium sm:text-[2.6rem]">{title}</h2>
          <p className="mt-4 text-lg text-white/75">{body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={routes.booking} variant="accent" size="lg">
              Book an Appointment <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonAnchor href={env.niraUrl} variant="inverse" size="lg" className="bg-white/10 text-white hover:bg-white/20">
              <Sparkles className="size-4" /> Ask Nira
            </ButtonAnchor>
          </div>
        </div>
      </div>
    </section>
  );
}
