import { CalendarCheck2, ClipboardList, HeartHandshake, Leaf, PlusSquare, ShieldCheck, UsersRound, type LucideIcon } from "lucide-react";
import type { WhyFemurContent } from "@/types/cms";

const ICONS: Record<string, LucideIcon> = {
  clipboard: ClipboardList,
  heart: HeartHandshake,
  shield: ShieldCheck,
  users: UsersRound,
  calendar: CalendarCheck2,
  leaf: Leaf,
  plus: PlusSquare,
};

export function WhyFemurGrid({ content }: { content: WhyFemurContent }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {content.differentiators.map((d, i) => {
        const Icon = ICONS[d.icon] ?? ClipboardList;
        return (
          <article key={d.title} data-reveal className={i === 0 ? "rounded-[1.25rem] bg-teal p-7 text-white sm:col-span-2 lg:col-span-1 lg:row-span-2" : "rounded-[1.25rem] border border-line bg-white p-7"}>
            <Icon className={i === 0 ? "size-8 text-sand" : "size-7 text-sage"} strokeWidth={1.6} />
            <h3 className={`mt-6 font-display text-2xl font-medium ${i === 0 ? "text-white" : "text-teal-deep"}`}>{d.title}</h3>
            <p className={`mt-3 leading-relaxed ${i === 0 ? "text-white/75" : "text-ink-soft"}`}>{d.description}</p>
          </article>
        );
      })}
    </div>
  );
}
