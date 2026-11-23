import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/section";
import { Bn } from "@/components/ui/bn";
import { routes } from "@/config/site";
import { maternalStages } from "@/content/maternal";

/** Core of the homepage: three stage cards (pre-pregnancy, pregnancy, postnatal), each linking to the right service. */
export function MaternalJourney() {
  return (
    <Section tone="white">
      <div className="container-page">
        <SectionHeading
          eyebrow="Maternal care"
          title="Support through every stage"
          intro="Whether you are planning, expecting or recovering, there is a gentle, expert plan for you."
          align="center"
        />
        <ul className="grid gap-5 lg:grid-cols-3">
          {maternalStages.map((s) => (
            <li key={s.id} data-reveal className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-line bg-cream">
              <div className="relative aspect-[16/11] overflow-hidden bg-mint-soft">
                <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 92vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-2xl font-medium text-teal-deep">{s.name}</h3>
                <Bn className="text-sm text-sage">{s.bn}</Bn>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{s.tagline}</p>
                <ul className="mt-4 flex-1 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-ink-soft">
                      <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-sage" /> {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                  <Link href={`${routes.maternal}#${s.id}`} className="text-sm font-semibold text-teal hover:text-teal-deep">Learn more</Link>
                  <Link href={routes.bookingFor(s.serviceSlug)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-teal-deep">
                    Book <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
