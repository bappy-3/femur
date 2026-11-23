import { ArrowRight, HeartHandshake, Lock, UserRoundCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { maternalStages } from "@/content/maternal";
import type { HeroContent } from "@/types/cms";

const TRUST = [
  { icon: UserRoundCheck, label: "Female physiotherapists" },
  { icon: Lock, label: "Private, respectful care" },
  { icon: HeartHandshake, label: "Works with your doctor" },
];

const OTHER = [
  { label: "Pain management", href: routes.service("pain-management") },
  { label: "Sports injury", href: routes.service("sports-injury-rehabilitation") },
  { label: "Orthopedic rehab", href: routes.service("orthopedic-rehabilitation") },
  { label: "Neurological rehab", href: routes.service("neurological-rehabilitation") },
  { label: "Nutrition", href: routes.service("nutritionist-consultancy") },
];

/**
 * Maternal-first hero: one message, two actions, three stage shortcuts.
 * Layout is fixed by aspect ratios and grid tracks (no layout shift), single column below `lg`, and `overflow-x-clip`.
 */
export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative isolate overflow-x-clip bg-mist">
      <div aria-hidden className="absolute -top-40 -right-32 -z-10 size-[36rem] rounded-full bg-mint-soft/70 sm:size-[46rem]" />
      <div className="container-page grid items-center gap-x-12 gap-y-10 pt-10 pb-12 sm:pt-14 sm:pb-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:pt-20 lg:pb-20">
        <div className="min-w-0">
          <p className="animate-fade-up text-sm font-semibold text-sage">Women&apos;s &amp; maternal physiotherapy · Uttara, Dhaka</p>
          <h1 className="mt-4 animate-fade-up text-[clamp(2.5rem,7vw,4.6rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-teal-deep [animation-delay:60ms]">
            {content.headline}
          </h1>
          <p className="mt-5 max-w-xl animate-fade-up text-base leading-relaxed text-ink-soft [animation-delay:120ms] sm:text-lg">{content.subheadline}</p>
          <p lang="bn" className="mt-2 max-w-xl animate-fade-up font-bn text-[0.95rem] text-sage [animation-delay:140ms]">
            গর্ভধারণের আগে, গর্ভাবস্থায় ও প্রসবের পর, মহিলা ফিজিওথেরাপিস্টের যত্নে।
          </p>
          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:180ms] sm:flex-row">
            <ButtonLink href={routes.bookingFor("pregnancy-rehabilitation")} size="lg">
              {content.primaryCta} <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href={routes.maternal} variant="secondary" size="lg">
              {content.secondaryCta}
            </ButtonLink>
          </div>
          <ul className="mt-8 flex animate-fade-up flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft [animation-delay:240ms]">
            {TRUST.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon aria-hidden className="size-4 shrink-0 text-sage" /> {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-lg animate-fade-up [animation-delay:140ms] lg:max-w-none">
          <div className="relative ml-auto aspect-[4/4.6] w-[88%] overflow-hidden rounded-t-[999px] rounded-b-[2rem] bg-mint-soft shadow-lift">
            <Image src={content.image.src} alt={content.image.alt} fill priority sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" />
          </div>
          {content.secondaryImage && (
            <div className="absolute bottom-8 left-0 aspect-square w-[32%] overflow-hidden rounded-full border-[6px] border-mist bg-mint-soft shadow-lift">
              <Image src={content.secondaryImage.src} alt="" fill sizes="(min-width: 1024px) 13vw, 28vw" className="object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="container-page pb-10 sm:pb-12">
        <nav aria-label="Choose your stage" className="grid gap-3 sm:grid-cols-3">
          {maternalStages.map((s) => (
            <Link
              key={s.id}
              href={`${routes.maternal}#${s.id}`}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-white px-5 py-4 transition-colors hover:border-sage/50"
            >
              <span>
                <span className="block font-semibold text-ink">{s.name}</span>
                <span lang="bn" className="block font-bn text-sm text-sage">{s.bn}</span>
              </span>
              <ArrowRight aria-hidden className="size-4 shrink-0 text-sage transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </nav>
        <p className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[0.95rem]">
          <span className="font-semibold text-ink">Also:</span>
          {OTHER.map((o) => (
            <Link key={o.label} href={o.href} className="rounded-full bg-white px-3.5 py-1.5 font-medium text-teal-deep ring-1 ring-line transition-colors hover:bg-mint-soft">
              {o.label}
            </Link>
          ))}
        </p>
      </div>
    </section>
  );
}
