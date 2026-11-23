import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Section({ className, tone = "plain", ...props }: ComponentProps<"section"> & { tone?: "plain" | "mist" | "teal" | "white" }) {
  const tones = { plain: "", mist: "bg-mist", teal: "bg-teal text-white", white: "bg-white" };
  return <section className={cn("py-16 sm:py-20", tones[tone], className)} {...props} />;
}

interface HeadingProps {
  eyebrow?: string;
  /** @deprecated Section numbers were removed for a cleaner look; kept so existing call sites compile. */
  index?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  inverse?: boolean;
  className?: string;
}

/** Section heading with Femur's numbered-eyebrow signature ("01 — Services"). */
export function SectionHeading({ eyebrow, title, intro, align = "left", action, inverse, className }: HeadingProps) {
  return (
    <div data-reveal className={cn("mb-10 flex flex-col gap-5 sm:mb-12 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className={cn("mb-4 flex items-center gap-3 text-[0.8rem] font-semibold tracking-[0.16em] uppercase", inverse ? "text-mint" : "text-sage", align === "center" && "justify-center")}>
            {eyebrow}
          </p>
        )}
        <h2 className={cn("text-[2.15rem] leading-[1.1] font-semibold sm:text-[2.85rem]", inverse ? "text-white" : "text-teal-deep")}>{title}</h2>
        {intro && <p className={cn("mt-4 text-[1.15rem] leading-relaxed", inverse ? "text-white/75" : "text-ink-soft")}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
