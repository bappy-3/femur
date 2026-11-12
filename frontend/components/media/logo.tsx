import { cn } from "@/lib/cn";

/** Femur brand mark: a movement arc rising to a joint — recovery as motion. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-9", className)}>
      <rect width="40" height="40" rx="12" fill="#415F66" />
      <path d="M10.5 29.5c3.2-.4 5.6-2 7.4-4.6l4.6-7c1.6-2.4 3.7-3.8 6.4-4.2" fill="none" stroke="#F5F5F2" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="29.6" cy="12.6" r="3.6" fill="#D6A77A" />
      <circle cx="10.6" cy="29.4" r="2.2" fill="#83B1A0" />
    </svg>
  );
}

export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[1.35rem] font-semibold tracking-[-0.02em]", inverse ? "text-white" : "text-teal-deep")}>Femur</span>
        <span className={cn("mt-0.5 text-[0.62rem] font-semibold tracking-[0.14em] uppercase", inverse ? "text-white/60" : "text-ink-soft")}>
          Physio &amp; Wellness
        </span>
      </span>
    </span>
  );
}
