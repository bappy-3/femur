import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Secondary-language (Bangla) text. Tagged lang="bn" for screen readers and uses the Bengali font. */
export function Bn({ className, ...props }: ComponentProps<"span">) {
  return <span lang="bn" className={cn("font-bn leading-relaxed", className)} {...props} />;
}
