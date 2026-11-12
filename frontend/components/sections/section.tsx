import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({ className, tone = "plain", ...props }: ComponentProps<"section"> & { tone?: "plain" | "mist" | "teal" | "white" }) {
  const tones = { plain: "", mist: "bg-mist", teal: "bg-teal text-white", white: "bg-white" };
  return <section className={cn("py-20 sm:py-24", tones[tone], className)} {...props} />;
}

interface HeadingProps {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  inverse?: boolean;
  className?: string;
}

/** Section heading with Femur's numbered-eyebrow signature ("01 — Services"). */
export function SectionHeading({ eyebrow, index, title, intro, align = "left", action, inverse, className }: HeadingProps) {
  return (
    <div data-reveal className={cn("mb-12 flex flex-col gap-6 sm:mb-14 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase", inverse ? "text-mint" : "text-sage", align === "center" && "justify-center")}>
            {index && <span className={cn("font-display text-sm tracking-normal", inverse ? "text-sand" : "text-sand-deep")}>{index}</span>}
            {index && <span aria-hidden className={cn("h-px w-8", inverse ? "bg-white/30" : "bg-sage/40")} />}
            {eyebrow}
          </p>
        )}
        <h2 className={cn("text-[2rem] leading-[1.08] font-medium sm:text-[2.6rem]", inverse ? "text-white" : "text-teal-deep")}>{title}</h2>
        {intro && <p className={cn("mt-4 text-[1.05rem] leading-relaxed", inverse ? "text-white/75" : "text-ink-soft")}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
