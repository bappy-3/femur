import { Plus } from "lucide-react";

/** Zero-JS accordion built on <details>. */
export function FaqList({ items }: { items: { id: string; question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
      {items.map((f) => (
        <details key={f.id} className="group px-5 sm:px-6 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-ink">
            {f.question}
            <Plus aria-hidden className="size-5 shrink-0 text-sage transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className="-mt-1 pb-5 leading-relaxed text-ink-soft">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
