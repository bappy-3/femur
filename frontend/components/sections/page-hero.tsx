import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Inner-page hero: compact, typographic, with the movement-arc motif. */
export function PageHero({ eyebrow, title, intro, children, className }: { eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section className={cn("relative overflow-hidden border-b border-line bg-mist/70", className)}>
      <MotionArc className="pointer-events-none absolute -right-24 -bottom-24 w-[34rem] text-sage/25 sm:-right-10" />
      <div className="container-page relative py-16 sm:py-20">
        <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-sage uppercase">{eyebrow}</p>
        <h1 className="max-w-3xl animate-fade-up text-[2.4rem] leading-[1.04] font-medium text-teal-deep sm:text-[3.4rem]">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-soft [animation-delay:80ms]">{intro}</p>}
        {children && <div className="mt-8 animate-fade-up [animation-delay:140ms]">{children}</div>}
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
