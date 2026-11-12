import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export type Tone = "teal" | "sand" | "mint" | "slate" | "rose" | "sky" | "outline";

const tones: Record<Tone, string> = {
  teal: "bg-teal/10 text-teal",
  sand: "bg-sand-soft text-sand-deep",
  mint: "bg-mint-soft text-[#3d6e5c]",
  slate: "bg-ink/[0.06] text-ink-soft",
  rose: "bg-rose-soft text-rose",
  sky: "bg-sky-soft text-sky",
  outline: "border border-line text-ink-soft",
};

export function Badge({ tone = "teal", className, ...props }: ComponentProps<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", tones[tone], className)}
      {...props}
    />
  );
}
