import Image from "next/image";
import { cn } from "@/lib/cn";

/** Femur brand mark (from the official logo file). */
export function LogoMark({ className }: { className?: string }) {
  return <Image src="/logo-mark.png" alt="" width={72} height={72} aria-hidden className={cn("size-9 rounded-xl", className)} />;
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
