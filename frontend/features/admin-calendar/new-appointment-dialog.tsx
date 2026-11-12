"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Overlay } from "@/components/ui/overlay";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/cn";
import { dhakaDateTimeToUtc, dhakaMinutesOfDay, minutesToTime, parseTime, toDhakaDate } from "@/lib/datetime";
import { maskPhone } from "@/lib/strings";
import { api } from "@/services";
import { fieldErrors, patientDetailsSchema } from "@/features/auth/schemas";
import type { PatientRecord } from "@/types/admin";
import type { Appointment } from "@/types/appointment";
import type { Service } from "@/types/catalog";
import type { Gender, ID } from "@/types/common";
import type { Practitioner } from "@/types/practitioner";

interface Props {
  open: boolean;
  initial: { practitionerId: ID; startsAt: string } | null;
  practitioners: Practitioner[];
  services: Service[];
  onClose: () => void;
  onCreated: (a: Appointment) => void;
}

export function NewAppointmentDialog({ open, initial, practitioners, services, onClose, onCreated }: Props) {
  const [practitionerId, setPractitionerId] = useState<ID>(initial?.practitionerId ?? practitioners[0]?.id ?? "");
  const practitioner = practitioners.find((p) => p.id === practitionerId);
  const offered = services.filter((s) => practitioner?.serviceIds.includes(s.id));
  const [serviceId, setServiceId] = useState<ID>(offered[0]?.id ?? "");
  const [date, setDate] = useState(initial ? toDhakaDate(initial.startsAt) : "");
  const [time, setTime] = useState(initial ? minutesToTime(dhakaMinutesOfDay(initial.startsAt)) : "10:00");
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<PatientRecord | null>(null);
  const [gender, setGender] = useState<Gender>(practitioner?.gender ?? "FEMALE");
  const [source, setSource] = useState<"WALK_IN" | "PHONE" | "ADMIN">("PHONE");
  const [override, setOverride] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const search = useAsync(() => (mode === "existing" && query.trim().length >= 2 ? api.admin.listPatients(query) : Promise.resolve([])), [mode, query]);

  const service = services.find((s) => s.id === serviceId) ?? offered[0];
  const patientGender = mode === "existing" ? picked?.gender : gender;
  const mismatch = useMemo(
    () => !!service && !!practitioner && !!patientGender && service.rules.genderPolicy === "REQUIRED_SAME_GENDER" && practitioner.gender !== patientGender,
    [service, practitioner, patientGender],
  );

  if (!open) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!service || !practitioner || !date || !time) return setError("Please choose a practitioner, service, date and time.");
    if (mismatch && !override.trim()) return setError("This service requires a same-gender practitioner. Enter an override reason or choose another practitioner.");
    let patient;
    if (mode === "existing") {
      if (!picked) return setError("Search and select a patient, or switch to New / walk-in.");
      patient = { patientId: picked.id, fullName: picked.fullName, gender: picked.gender, dateOfBirth: null, ageYears: picked.ageYears, phone: picked.phone, email: picked.email, relationship: "SELF" as const };
    } else {
      const raw = Object.fromEntries(new FormData(e.currentTarget));
      const parsed = patientDetailsSchema.safeParse({ ...raw, gender, relationship: "SELF", reasonForVisit: "" });
      if (!parsed.success) return setErrors(fieldErrors(parsed.error));
      setErrors({});
      const { reasonForVisit: _r, ...p } = parsed.data;
      void _r;
      patient = { ...p, patientId: null, dateOfBirth: null };
    }
    const reason = String(new FormData(e.currentTarget).get("reason") ?? "").trim() || null;
    setPending(true);
    try {
      const created = await api.admin.createAppointment({
        serviceId: service.id,
        practitionerId: practitioner.id,
        startsAt: dhakaDateTimeToUtc(date, parseTime(time)).toISOString(),
        patient,
        reasonForVisit: reason,
        preferredPractitionerId: null,
        source,
        overrideReason: mismatch ? override.trim() : null,
      });
      onCreated(created);
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Overlay open variant="drawer" onClose={onClose} title="New appointment" description="Book on behalf of a patient (phone, walk-in or admin).">
      <form onSubmit={submit} noValidate className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Practitioner" htmlFor="na-p">
            <Select
              id="na-p"
              value={practitionerId}
              onChange={(e) => {
                setPractitionerId(e.target.value);
                const next = practitioners.find((p) => p.id === e.target.value);
                setServiceId(services.find((s) => next?.serviceIds.includes(s.id))?.id ?? "");
              }}
            >
              {practitioners.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName} ({p.gender === "FEMALE" ? "F" : "M"})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Service" htmlFor="na-s">
            <Select id="na-s" value={service?.id ?? ""} onChange={(e) => setServiceId(e.target.value)}>
              {offered.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.rules.durationMinutes}m
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Date" htmlFor="na-d">
            <Input id="na-d" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="Start time" htmlFor="na-t">
            <Input id="na-t" type="time" step={900} value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-ink">Patient</legend>
          <div className="mb-3 inline-flex rounded-full border border-line bg-white p-1">
            {(["existing", "new"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setMode(m)} className={cn("rounded-full px-3.5 py-1 text-sm font-medium", mode === m ? "bg-teal text-white" : "text-ink-soft")}>
                {m === "existing" ? "Existing patient" : "New / walk-in"}
              </button>
            ))}
          </div>
          {mode === "existing" ? (
            <div className="space-y-2">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
                <Input aria-label="Search patients" placeholder="Name, phone or MRN" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <ul className="max-h-48 divide-y divide-line overflow-y-auto rounded-xl border border-line">
                {(search.data ?? []).slice(0, 8).map((p) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => setPicked(p)} className={cn("flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-mist", picked?.id === p.id && "bg-mist")}>
                      <span>
                        <span className="font-semibold text-ink">{p.fullName}</span> <span className="text-xs text-ink-soft">{p.gender === "FEMALE" ? "F" : "M"} · {p.medicalRecordNo}</span>
                      </span>
                      <span className="text-xs text-ink-soft">{maskPhone(p.phone)}</span>
                    </button>
                  </li>
                ))}
                {query.trim().length >= 2 && !search.loading && (search.data ?? []).length === 0 && <li className="px-3 py-2 text-sm text-ink-soft">No patients found.</li>}
                {query.trim().length < 2 && <li className="px-3 py-2 text-sm text-ink-soft">Type at least 2 characters.</li>}
              </ul>
              {picked && <p className="text-sm text-teal">Selected: {picked.fullName}</p>}
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full name" htmlFor="na-name" error={errors.fullName} className="sm:col-span-2">
                <Input id="na-name" name="fullName" aria-invalid={!!errors.fullName} />
              </Field>
              <Field label="Gender" htmlFor="na-g">
                <Select id="na-g" value={gender} onChange={(e) => setGender(e.target.value as Gender)}>
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                </Select>
              </Field>
              <Field label="Age" htmlFor="na-age" error={errors.ageYears}>
                <Input id="na-age" name="ageYears" type="number" aria-invalid={!!errors.ageYears} />
              </Field>
              <Field label="Mobile" htmlFor="na-phone" error={errors.phone}>
                <Input id="na-phone" name="phone" type="tel" aria-invalid={!!errors.phone} />
              </Field>
              <Field label="Email" htmlFor="na-email" optional error={errors.email}>
                <Input id="na-email" name="email" type="email" />
              </Field>
            </div>
          )}
        </fieldset>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Source" htmlFor="na-src">
            <Select id="na-src" value={source} onChange={(e) => setSource(e.target.value as typeof source)}>
              <option value="PHONE">Phone</option>
              <option value="WALK_IN">Walk-in</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </Field>
          <Field label="Reason for visit" htmlFor="na-reason" optional>
            <Input id="na-reason" name="reason" />
          </Field>
        </div>

        {mismatch && (
          <Alert tone="warning" title="Gender policy">
            {service?.name} normally requires a same-gender practitioner. An override is recorded in the audit log.
            <Textarea aria-label="Override reason" className="mt-2 bg-white" rows={2} placeholder="Reason for override" value={override} onChange={(e) => setOverride(e.target.value)} />
          </Alert>
        )}
        {error && <Alert tone="error">{error}</Alert>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Spinner />} Create appointment
          </Button>
        </div>
      </form>
    </Overlay>
  );
}
