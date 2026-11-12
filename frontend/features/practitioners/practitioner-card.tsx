import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Monogram } from "@/components/ui/monogram";
import type { Practitioner } from "@/types/practitioner";

export function PractitionerCard({ practitioner: p, serviceNames }: { practitioner: Practitioner; serviceNames?: string[] }) {
  return (
    <article data-reveal className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white">
      <div className="relative aspect-[4/4.4] bg-mist">
        {p.photo ? (
          <Image src={p.photo.src} alt={p.photo.alt} fill sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 92vw" className="object-cover object-top" />
        ) : (
          <Monogram name={p.displayName} color={p.color} className="absolute inset-0 size-full rounded-none text-5xl" />
        )}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          <Badge tone={p.gender === "FEMALE" ? "sand" : "teal"} className="bg-white/95">
            {p.gender === "FEMALE" ? "Female" : "Male"} practitioner
          </Badge>
          {p.isVisiting && (
            <Badge tone="outline" className="bg-white/95">
              Visiting
            </Badge>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-medium text-teal-deep">{p.displayName}</h3>
        <p className="text-sm text-ink-soft">{p.designation}</p>
        <dl className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-xs font-semibold tracking-wide text-ink-soft uppercase">Specialisation</dt>
            <dd className="mt-0.5 text-ink">{p.specialization}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-ink-soft uppercase">Qualifications</dt>
            <dd className="mt-0.5 text-ink">{p.qualifications.join(", ")}</dd>
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
              <dd className="mt-0.5 text-ink-soft">
                {serviceNames.slice(0, 4).join(" · ")}
                {serviceNames.length > 4 ? ` +${serviceNames.length - 4}` : ""}
              </dd>
            </div>
          )}
        </dl>
        <p className="mt-auto flex items-center gap-2 pt-5 text-sm font-medium text-teal">
          <CalendarDays className="size-4 text-sage" /> {p.availabilitySummary}
        </p>
      </div>
    </article>
  );
}
