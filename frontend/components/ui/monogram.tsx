import { cn } from "@/lib/cn";
import { initials } from "@/lib/strings";

/** Initials avatar — used until a real, consented practitioner photo is uploaded. */
export function Monogram({ name, color = "#1B7452", className }: { name: string; color?: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("grid shrink-0 place-items-center rounded-full font-display font-medium text-white", className)}
      style={{ background: `linear-gradient(140deg, ${color}, color-mix(in oklab, ${color} 70%, #25383B))` }}
    >
      {initials(name) || "F"}
    </span>
  );
}
