"use client";

import { ArrowRight, UserRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { cn } from "@/lib/cn";
import type { Gender, ID } from "@/types/common";
import type { SavedPatient } from "@/types/user";
import { fieldErrors, patientDetailsSchema, type PatientDetails } from "@/features/auth/schemas";
import { StepHeader } from "../step-header";

type Value = PatientDetails & { patientId: ID | null };

interface Props {
  gender: Gender;
  initial: Value | null;
  savedPatients: SavedPatient[];
  onSubmit: (value: Value) => void;
  onChangeGender: () => void;
}

const RELATIONSHIPS = [
  { value: "CHILD", label: "My child" },
  { value: "PARENT", label: "My parent" },
  { value: "SPOUSE", label: "My spouse" },
  { value: "SIBLING", label: "My sibling" },
  { value: "OTHER", label: "Someone else" },
] as const;

export function PatientStep({ gender, initial, savedPatients, onSubmit, onChangeGender }: Props) {
  const [forSelf, setForSelf] = useState(initial ? initial.relationship === "SELF" : true);
  const [selectedSaved, setSelectedSaved] = useState<ID | null>(initial?.patientId ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const matching = savedPatients.filter((p) => p.gender === gender);
  const prefill = matching.find((p) => p.id === selectedSaved) ?? null;
  const v = prefill ?? initial;

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = patientDetailsSchema.safeParse({ ...data, gender, relationship: forSelf ? "SELF" : data.relationship });
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      const first = e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setErrors({});
    onSubmit({ ...parsed.data, patientId: prefill?.id ?? null });
  }

  return (
    <div>
      <StepHeader step={3} title="Patient details" description="Just the essentials — this takes less than a minute." />

      {matching.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-semibold text-ink">Book for a saved profile</p>
          <div className="flex flex-wrap gap-2">
            {matching.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedSaved(p.id === selectedSaved ? null : p.id);
                  setForSelf(p.relationship === "SELF");
                }}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors",
                  p.id === selectedSaved ? "border-teal bg-teal text-white" : "border-line bg-white text-ink hover:border-sage",
                )}
              >
                <UserRound className="size-4" /> {p.fullName}
                <span className="text-xs opacity-70">{p.relationship === "SELF" ? "You" : p.relationship.toLowerCase()}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form key={selectedSaved ?? "new"} onSubmit={submit} noValidate className="space-y-5">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Who is this appointment for?</legend>
          <div className="inline-flex rounded-full border border-line bg-white p-1">
            {[
              { label: "Myself", value: true },
              { label: "Someone else", value: false },
            ].map((o) => (
              <button
                key={o.label}
                type="button"
                aria-pressed={forSelf === o.value}
                onClick={() => setForSelf(o.value)}
                className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors", forSelf === o.value ? "bg-teal text-white" : "text-ink-soft hover:text-ink")}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
          <Field label={forSelf ? "Your full name" : "Patient's full name"} htmlFor="fullName" error={errors.fullName}>
            <Input id="fullName" name="fullName" autoComplete={forSelf ? "name" : "off"} defaultValue={v?.fullName ?? ""} aria-invalid={!!errors.fullName} />
          </Field>
          <Field label="Age" htmlFor="ageYears" error={errors.ageYears}>
            <Input id="ageYears" name="ageYears" type="number" inputMode="numeric" min={0} max={120} defaultValue={v?.ageYears ?? ""} aria-invalid={!!errors.ageYears} />
          </Field>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-mist px-4 py-3 text-sm">
          <span className="text-ink-soft">
            Gender: <strong className="text-ink">{gender === "FEMALE" ? "Female" : "Male"}</strong>
          </span>
          <button type="button" onClick={onChangeGender} className="font-semibold text-teal hover:text-teal-deep">
            Change
          </button>
        </div>

        {!forSelf && (
          <Field label="Relationship to you" htmlFor="relationship">
            <Select id="relationship" name="relationship" defaultValue={v && v.relationship !== "SELF" ? v.relationship : "OTHER"}>
              {RELATIONSHIPS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
          </Field>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mobile number" htmlFor="phone" error={errors.phone} hint="For your confirmation and reminders">
            <Input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="01XXXXXXXXX" defaultValue={v?.phone ?? ""} aria-invalid={!!errors.phone} />
          </Field>
          <Field label="Email" htmlFor="email" optional error={errors.email}>
            <Input id="email" name="email" type="email" autoComplete="email" defaultValue={v?.email ?? ""} aria-invalid={!!errors.email} />
          </Field>
        </div>

        <Field label="Reason for visit" htmlFor="reasonForVisit" optional error={errors.reasonForVisit} hint="A few words help us prepare, e.g. “lower back pain for 2 weeks”. Seen only by clinic staff.">
          <Textarea id="reasonForVisit" name="reasonForVisit" rows={3} defaultValue={initial?.reasonForVisit ?? ""} maxLength={500} />
        </Field>

        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Continue to date <ArrowRight className="size-4" />
        </Button>
      </form>
    </div>
  );
}
