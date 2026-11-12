"use client";

import { Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Service } from "@/types/catalog";
import type { Gender } from "@/types/common";
import { StepHeader } from "../step-header";

const OPTIONS: { value: Gender; label: string; practitioner: string }[] = [
  { value: "FEMALE", label: "Female patient", practitioner: "female" },
  { value: "MALE", label: "Male patient", practitioner: "male" },
];

export function GenderStep({ service, selected, onSelect }: { service: Service; selected: Gender | null; onSelect: (g: Gender) => void }) {
  const { genderPolicy, eligibleGenders } = service.rules;
  return (
    <div>
      <StepHeader step={2} title="Who is the patient?" description="Select the gender of the person attending the appointment." />
      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((o) => {
          const eligible = eligibleGenders.length === 0 || eligibleGenders.includes(o.value);
          const isSelected = selected === o.value;
          return (
            <button
              key={o.value}
              type="button"
              disabled={!eligible}
              aria-pressed={isSelected}
              onClick={() => onSelect(o.value)}
              className={cn(
                "relative rounded-2xl border bg-white p-6 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50",
                isSelected ? "border-teal ring-3 ring-teal/15" : "border-line enabled:hover:border-sage/60 enabled:hover:shadow-[var(--shadow-soft)]",
              )}
            >
              <span className="block font-display text-2xl font-medium text-teal-deep">{o.label}</span>
              <span className="mt-2 block text-sm text-ink-soft">
                {!eligible
                  ? `${service.name} is provided for female patients only.`
                  : genderPolicy === "REQUIRED_SAME_GENDER"
                    ? `You'll be seen by a ${o.practitioner} practitioner.`
                    : genderPolicy === "PREFERRED"
                      ? `We'll match a ${o.practitioner} practitioner where available.`
                      : "Seen by the visiting specialist on duty."}
              </span>
              {isSelected && (
                <span className="absolute top-4 right-4 grid size-6 place-items-center rounded-full bg-teal text-white">
                  <Check className="size-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {genderPolicy === "REQUIRED_SAME_GENDER" && (
        <p className="mt-5 flex items-start gap-2.5 rounded-xl bg-mist px-4 py-3 text-sm text-ink-soft">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sage" />
          Femur matches physiotherapy patients with a practitioner of the same gender. Only matching practitioners&apos; times will be shown.
        </p>
      )}
    </div>
  );
}
