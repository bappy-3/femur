import { ArrowUpRight, CalendarClock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/site";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import type { Service } from "@/types/catalog";
import { ServiceIcon } from "./service-icon";

/** Image-led card for primary physiotherapy services. */
export function ServiceCard({ service, priority = false, className }: { service: Service; priority?: boolean; className?: string }) {
  return (
    <Link
      href={routes.service(service.slug)}
      data-reveal
      className={cn("group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-shadow duration-300 hover:shadow-[var(--shadow-soft)]", className)}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3 grid size-10 place-items-center rounded-full bg-white/95 text-teal shadow-sm">
          <ServiceIcon icon={service.icon} className="size-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="flex items-start justify-between gap-3 font-display text-xl font-medium text-teal-deep">
          {service.name}
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-sage transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{service.summary}</p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs">
          <span className="text-ink-soft">
            {service.availabilityNote ?? `${service.rules.durationMinutes}-min sessions`}
          </span>
          {service.startingPrice && <span className="font-semibold text-teal">From {formatMoney(service.startingPrice)}</span>}
        </div>
      </div>
    </Link>
  );
}

/** Compact row card used for consultancy (secondary) services. */
export function ConsultancyCard({ service }: { service: Service }) {
  return (
    <Link
      href={routes.service(service.slug)}
      data-reveal
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-colors hover:border-sage/50 sm:flex-row"
    >
      <span className="relative block aspect-[16/9] shrink-0 bg-mist sm:aspect-auto sm:w-36">
        <Image src={service.image.src} alt={service.image.alt} fill sizes="(min-width: 640px) 144px, 92vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <span className="absolute top-2.5 left-2.5 grid size-8 place-items-center rounded-full bg-white/95 text-teal">
          <ServiceIcon icon={service.icon} className="size-4" />
        </span>
      </span>
      <span className="min-w-0 flex-1 p-5">
        <span className="block font-semibold text-ink">{service.name}</span>
        <span className="mt-1 block text-sm text-ink-soft">{service.summary}</span>
        {service.availabilityNote && (
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sand-soft px-2.5 py-1 text-xs font-medium text-sand-deep">
            <CalendarClock className="size-3.5" /> {service.availabilityNote}
          </span>
        )}
      </span>
    </Link>
  );
}
