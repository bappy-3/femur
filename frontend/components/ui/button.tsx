import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger" | "inverse";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-[-0.005em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-teal text-white shadow-[0_1px_0_rgb(255_255_255/0.15)_inset] hover:bg-teal-deep",
  accent: "bg-sand text-teal-deep hover:bg-sand-deep hover:text-white",
  secondary: "border border-teal/25 bg-white/70 text-teal hover:border-teal/50 hover:bg-white",
  ghost: "text-teal hover:bg-mist",
  danger: "bg-rose text-white hover:bg-rose/90",
  inverse: "bg-white text-teal-deep hover:bg-cream",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4.5 text-[0.9rem]",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-[1.05rem]",
};

export interface ButtonStyleProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

export const buttonClass = ({ variant = "primary", size = "md", className }: ButtonStyleProps = {}) =>
  cn(base, variants[variant], sizes[size], className);

export function Button({ variant, size, className, type = "button", ...props }: ComponentProps<"button"> & ButtonStyleProps) {
  return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & ButtonStyleProps) {
  return <Link className={buttonClass({ variant, size, className })} {...props} />;
}

/** External link styled as a button (e.g. Nira subdomain). */
export function ButtonAnchor({ variant, size, className, ...props }: ComponentProps<"a"> & ButtonStyleProps) {
  return <a className={buttonClass({ variant, size, className })} {...props} />;
}
