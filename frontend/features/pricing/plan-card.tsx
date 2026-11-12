import { Check, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/site";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import type { MembershipPlan } from "@/types/membership";

const PERIOD: Record<MembershipPlan["billingPeriod"], string> = { MONTHLY: "/ month", QUARTERLY: "/ 3 months", ANNUAL: "/ year" };

export function PlanCard({ plan, ctaHref = routes.account.membership, ctaLabel = "Choose plan" }: { plan: MembershipPlan; ctaHref?: string; ctaLabel?: string }) {
  const featured = plan.isHighlighted;
  return (
    <article
      data-reveal
      className={cn(
        "relative flex flex-col rounded-[1.25rem] border p-6 sm:p-7",
        featured ? "border-teal bg-teal text-white shadow-[var(--shadow-lift)]" : "border-line bg-white",
      )}
    >
      {featured && <span className="absolute -top-3 left-6 rounded-full bg-sand px-3 py-1 text-xs font-semibold text-teal-deep">Most popular</span>}
      <h3 className={cn("font-display text-2xl font-medium", featured ? "text-white" : "text-teal-deep")}>{plan.name}</h3>
      <p className={cn("mt-1 text-sm", featured ? "text-white/70" : "text-ink-soft")}>{plan.tagline}</p>
      <p className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-medium tracking-tight">{formatMoney(plan.price)}</span>
        <span className={cn("text-sm", featured ? "text-white/60" : "text-ink-soft")}>{PERIOD[plan.billingPeriod]}</span>
      </p>
      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {plan.benefits.map((b) => (
          <li key={b} className="flex gap-2.5">
            {b.toLowerCase().includes("nira") ? (
              <Sparkles className={cn("mt-0.5 size-4 shrink-0", featured ? "text-sand" : "text-sand-deep")} />
            ) : (
              <Check className={cn("mt-0.5 size-4 shrink-0", featured ? "text-mint" : "text-sage")} />
            )}
            <span className={featured ? "text-white/90" : "text-ink"}>{b}</span>
          </li>
        ))}
      </ul>
      <ButtonLink href={ctaHref} variant={featured ? "accent" : "secondary"} className="mt-8 w-full">
        {ctaLabel}
      </ButtonLink>
    </article>
  );
}
