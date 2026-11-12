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

/** Inner-page hero: photographic when an image is given, otherwise a quiet typographic band. */
export function PageHero({ eyebrow, title, intro, children, className, image }: Props) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-line", image ? "bg-teal-deep" : "bg-mist/70", className)}>
      {image ? (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-teal-deep/85 via-teal-deep/65 to-teal-deep/40" />
        </>
      ) : (
        <MotionArc className="pointer-events-none absolute -right-24 -bottom-24 w-[34rem] text-sage/25 sm:-right-10" />
      )}
      <div className="container-page relative py-20 sm:py-28">
        <p className={cn("mb-4 text-xs font-semibold tracking-[0.18em] uppercase", image ? "text-mint" : "text-sage")}>{eyebrow}</p>
        <h1 className={cn("max-w-3xl animate-fade-up text-[2.4rem] leading-[1.04] font-medium sm:text-[3.4rem]", image ? "text-white [&_em]:!text-mint" : "text-teal-deep")}>{title}</h1>
        {intro && <p className={cn("mt-5 max-w-2xl animate-fade-up text-lg leading-relaxed [animation-delay:80ms]", image ? "text-white/85" : "text-ink-soft")}>{intro}</p>}
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
