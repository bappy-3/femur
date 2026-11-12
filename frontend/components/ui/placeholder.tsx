import { PencilLine } from "lucide-react";
import { isMockMode } from "@/config/env";
import { cn } from "@/lib/cn";

/**
 * Marks content that is awaiting real information from Femur (address, story, credentials …).
 * Editors replace it in the CMS; the marker disappears once `isPlaceholder` is false.
 */
export function PlaceholderMark({ className, label = "Placeholder" }: { className?: string; label?: string }) {
  return (
    <span
      title="Awaiting confirmed information — editable in Admin › Website CMS"
      className={cn("inline-flex items-center gap-1 rounded-full border border-dashed border-sand-deep/50 bg-sand-soft/60 px-2 py-0.5 align-middle text-[0.7rem] font-semibold tracking-wide text-sand-deep uppercase", className)}
    >
      <PencilLine aria-hidden className="size-3" /> {label}
    </span>
  );
}

/** Visible banner whenever the app runs on sample data (NEXT_PUBLIC_API_MODE=mock). */
export function DemoNotice({ className, children }: { className?: string; children?: React.ReactNode }) {
  if (!isMockMode) return null;
  return (
    <p className={cn("rounded-xl border border-dashed border-sand-deep/40 bg-sand-soft/50 px-4 py-2.5 text-xs leading-relaxed text-[#7d5631]", className)}>
      <strong className="font-semibold">Demo data.</strong>{" "}
      {children ?? "Prices, practitioner profiles and figures shown here are samples for design review — not Femur's actual information."}
    </p>
  );
}
