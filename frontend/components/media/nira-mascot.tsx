import Image from "next/image";
import { cn } from "@/lib/cn";

/** Nira, Femur's AI Consultant mascot. The artwork has a white background, so it sits on a white disc. */
export function NiraMascot({ size = 120, className }: { size?: number; className?: string }) {
  return (
    <span className={cn("inline-block overflow-hidden rounded-full bg-white shadow-[var(--shadow-soft)] ring-4 ring-white/60", className)} style={{ width: size, height: size }}>
      <Image src="/nira-mascot.jpg" alt="Nira, Femur's AI Consultant mascot" width={size * 2} height={Math.round(size * 2 * (940 / 700))} className="size-full object-cover object-[50%_20%]" />
    </span>
  );
}
