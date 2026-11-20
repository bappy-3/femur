import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  className?: string;
  /** Photographic background (URL). When set the hero turns dark with white text. */
  image?: string;
}

/** Inner-page hero: pale-green clinical band; an optional photo sits in an arched frame on the right. */
export function PageHero({ eyebrow, title, intro, children, className, image }: Props) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-line bg-mist", className)}>
      <div aria-hidden className="absolute -top-32 -right-32 -z-10 size-[30rem] rounded-full bg-mint-soft/80" />
      {!image && <MotionArc className="pointer-events-none absolute -right-24 -bottom-24 -z-10 w-[34rem] text-sage/30 sm:-right-10" />}
      <div className={cn("container-page relative grid items-center gap-10 py-16 sm:py-24", image && "lg:grid-cols-[1.3fr_1fr]")}>
        <div>
          <p className="mb-4 text-sm font-semibold text-sage">{eyebrow}</p>
          <h1 className="max-w-3xl animate-fade-up text-[2.4rem] leading-[1.04] font-semibold text-teal-deep sm:text-[3.4rem]">{title}</h1>
          {intro && <p className="mt-5 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-soft [animation-delay:80ms]">{intro}</p>}
          {children && <div className="mt-8 animate-fade-up [animation-delay:140ms]">{children}</div>}
        </div>
        {image && (
          <div className="relative hidden aspect-[4/3.4] animate-fade-up overflow-hidden rounded-t-[999px] rounded-b-3xl bg-mint-soft shadow-lift [animation-delay:100ms] lg:block">
            <Image src={image} alt="" fill priority sizes="30vw" className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}

/** Decorative motif: concentric arcs suggesting a joint's range of motion. */
export function MotionArc({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" fill="none" aria-hidden className={className}>
      {[180, 140, 100, 60].map((r, i) => (
        <path key={r} d={`M ${200 - r} 200 A ${r} ${r} 0 0 1 ${200 + r} 200`} stroke="currentColor" strokeWidth={i === 0 ? 1.5 : 1} strokeDasharray={i % 2 ? "2 6" : undefined} />
      ))}
      <circle cx="200" cy="200" r="8" fill="currentColor" />
    </svg>
  );
}
