import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Monogram } from "@/components/ui/monogram";
import { PlaceholderMark } from "@/components/ui/placeholder";
import type { Practitioner } from "@/types/practitioner";

export function PractitionerCard({ practitioner: p, serviceNames }: { practitioner: Practitioner; serviceNames?: string[] }) {
  return (
    <article data-reveal className="flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-5">
      <div className="flex items-center gap-4">
        {p.photo ? (
          <Image src={p.photo.src} alt={p.photo.alt} width={64} height={64} className="size-16 rounded-full object-cover" />
        ) : (
          <Monogram name={p.displayName} color={p.color} className="size-16 text-xl" />
        )}
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-medium text-teal-deep">{p.displayName}</h3>
          <p className="text-sm text-ink-soft">{p.designation}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge tone={p.gender === "FEMALE" ? "sand" : "teal"}>{p.gender === "FEMALE" ? "Female" : "Male"} practitioner</Badge>
            {p.isVisiting && <Badge tone="outline">Visiting</Badge>}
          </div>
        </div>
      </div>
      <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
        <div>
          <dt className="text-xs font-semibold tracking-wide text-ink-soft uppercase">Specialisation</dt>
          <dd className="mt-0.5 text-ink">{p.specialization}</dd>
        </div>
        <div>
          <dt className="text-xs font-semibold tracking-wide text-ink-soft uppercase">Qualifications</dt>
          <dd className="mt-0.5 text-ink">
            {p.qualifications.join(", ")} {p.isPlaceholder && <PlaceholderMark className="ml-1" />}
          </dd>
        </div>
        {p.experienceYears !== null && (
          <div>
            <dt className="text-xs font-semibold tracking-wide text-ink-soft uppercase">Experience</dt>
            <dd className="mt-0.5 text-ink">{p.experienceYears}+ years</dd>
          </div>
        )}
        {serviceNames && serviceNames.length > 0 && (
          <div>
            <dt className="text-xs font-semibold tracking-wide text-ink-soft uppercase">Services</dt>
            <dd className="mt-0.5 text-ink-soft">{serviceNames.slice(0, 4).join(" · ")}{serviceNames.length > 4 ? ` +${serviceNames.length - 4}` : ""}</dd>
          </div>
        )}
      </dl>
      <p className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-teal">
        <CalendarDays className="size-4 text-sage" /> {p.availabilitySummary}
      </p>
    </article>
  );
}
