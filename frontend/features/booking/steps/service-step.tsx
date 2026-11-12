"use client";

import { Check, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/money";
import type { Service } from "@/types/catalog";
import { ServiceIcon } from "@/features/service-catalog/service-icon";
import { StepHeader } from "../step-header";

interface Props {
  services: Service[];
  selectedId: string | null;
  onSelect: (service: Service) => void;
}

function ServiceOption({ service, selected, onSelect }: { service: Service; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-start gap-3.5 rounded-2xl border bg-white p-4 text-left transition-all",
        selected ? "border-teal ring-3 ring-teal/15" : "border-line hover:border-sage/60 hover:shadow-[var(--shadow-soft)]",
      )}
    >
      <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl transition-colors", selected ? "bg-teal text-white" : "bg-mist text-teal")}>
        <ServiceIcon icon={service.icon} className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold text-ink">{service.name}</span>
        <span className="mt-0.5 line-clamp-2 block text-sm text-ink-soft">{service.summary}</span>
        <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {service.rules.durationMinutes} min
          </span>
          {service.startingPrice && <span className="font-semibold text-teal">{formatMoney(service.startingPrice)}</span>}
          {service.availabilityNote && <span className="font-medium text-sand-deep">{service.availabilityNote}</span>}
        </span>
      </span>
      {selected && (
        <span className="absolute top-3 right-3 grid size-5 place-items-center rounded-full bg-teal text-white">
          <Check className="size-3" />
        </span>
      )}
    </button>
  );
}

export function ServiceStep({ services, selectedId, onSelect }: Props) {
  const physio = services.filter((s) => s.kind === "PHYSIOTHERAPY");
  const consult = services.filter((s) => s.kind === "CONSULTANCY");
  return (
    <div>
      <StepHeader step={1} title="What would you like to book?" description="Not sure? Choose Physiotherapy — your physiotherapist will assess you and recommend the right plan." />
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 font-sans text-sm font-semibold tracking-normal text-ink-soft">Physiotherapy & rehabilitation</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {physio.map((s) => (
              <ServiceOption key={s.id} service={s} selected={s.id === selectedId} onSelect={() => onSelect(s)} />
            ))}
          </div>
        </section>
        {consult.length > 0 && (
          <section>
            <h2 className="mb-3 font-sans text-sm font-semibold tracking-normal text-ink-soft">Consultancy · visiting specialists</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {consult.map((s) => (
                <ServiceOption key={s.id} service={s} selected={s.id === selectedId} onSelect={() => onSelect(s)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
