import { Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import type { PriceItem, PriceItemKind } from "@/types/membership";

const GROUPS: { kind: PriceItemKind; title: string; note: string }[] = [
  { kind: "SESSION", title: "Individual sessions", note: "Pay per visit" },
  { kind: "PACKAGE", title: "Treatment packages", note: "Save on a full programme" },
  { kind: "CONSULTATION", title: "Consultation fees", note: "Visiting specialists" },
  { kind: "OFFER", title: "Special offers", note: "Limited time" },
];

export function PriceTables({ items }: { items: PriceItem[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {GROUPS.map((g) => {
        const rows = items.filter((i) => i.kind === g.kind);
        if (rows.length === 0) return null;
        return (
          <section key={g.kind} data-reveal className="rounded-[var(--radius-card)] border border-line bg-white">
            <header className="flex items-baseline justify-between border-b border-line px-6 py-4">
              <h2 className="font-display text-xl font-medium text-teal-deep">{g.title}</h2>
              <span className="text-xs text-ink-soft">{g.note}</span>
            </header>
            <ul className="divide-y divide-line">
              {rows.map((item) => (
                <li key={item.id} className="flex items-start justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{item.name}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">{item.description}</p>
                    {item.validTo && (
                      <Badge tone="sand" className="mt-2">
                        <Tag className="size-3" /> Until {formatDate(item.validTo)}
                      </Badge>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-display text-xl font-medium text-teal">{formatMoney(item.amount)}</p>
                    {item.compareAtAmount && <p className="text-xs text-ink-soft line-through">{formatMoney(item.compareAtAmount)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
