"use client";

import { ArrowLeft, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, EmptyState, Skeleton, Spinner } from "@/components/ui/feedback";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Overlay } from "@/components/ui/overlay";
import { AppointmentStatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { routes } from "@/config/site";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { formatDate, formatTime } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import { maskPhone, titleCase } from "@/lib/strings";
import { api } from "@/services";
import { fieldErrors, patientDetailsSchema } from "@/features/auth/schemas";
import type { ID } from "@/types/common";

export function PatientsList() {
  const { notify } = useToast();
  const [q, setQ] = useState("");
  const [registering, setRegistering] = useState(false);
  const list = useAsync(() => api.admin.listPatients(q), [q]);

  return (
    <div className="space-y-5">
      <PageTitle
        title="Patients"
        description="Search patient records. Phone numbers are masked in lists."
        actions={
          <Button onClick={() => setRegistering(true)}>
            <UserPlus className="size-4" /> Register walk-in
          </Button>
        }
      />
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
        <Input aria-label="Search patients" placeholder="Name, phone or MRN" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>
      {list.loading && !list.data ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : (list.data ?? []).length === 0 ? (
        <EmptyState title="No patients found" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[48rem] text-sm">
            <thead className="bg-mist/60 text-left text-xs tracking-wide text-ink-soft uppercase">
              <tr>
                {["Patient", "MRN", "Phone", "Visits", "Last visit", "Membership"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {(list.data ?? []).map((p) => (
                <tr key={p.id} className="hover:bg-mist/40">
                  <td className="px-4 py-3">
                    <Link href={routes.admin.patient(p.id)} className="font-semibold text-teal hover:text-teal-deep">
                      {p.fullName}
                    </Link>
                    <span className="block text-xs text-ink-soft">
                      {p.gender === "FEMALE" ? "Female" : "Male"} · {p.ageYears ?? "—"} yrs {p.isWalkIn && "· walk-in"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{p.medicalRecordNo}</td>
                  <td className="px-4 py-3">{maskPhone(p.phone)}</td>
                  <td className="px-4 py-3">{p.totalVisits}</td>
                  <td className="px-4 py-3">{p.lastVisit ? formatDate(p.lastVisit) : "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={p.membershipStatus === "ACTIVE" ? "mint" : "slate"}>{titleCase(p.membershipStatus === "NONE" ? "free" : p.membershipStatus)}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {registering && (
        <RegisterWalkIn
          onClose={() => setRegistering(false)}
          onCreated={(name) => {
            list.reload();
            notify(`${name} registered.`);
          }}
        />
      )}
    </div>
  );
}

function RegisterWalkIn({ onClose, onCreated }: { onClose: () => void; onCreated: (name: string) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = patientDetailsSchema.safeParse({ ...Object.fromEntries(new FormData(e.currentTarget)), relationship: "SELF", reasonForVisit: "" });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setPending(true);
    try {
      const { fullName, gender, ageYears, phone, email } = parsed.data;
      await api.admin.createPatient({ fullName, gender, ageYears, phone, email });
      onCreated(fullName);
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }
  return (
    <Overlay open onClose={onClose} title="Register walk-in patient">
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field label="Full name" htmlFor="w-name" error={errors.fullName}>
          <Input id="w-name" name="fullName" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gender" htmlFor="w-g">
            <Select id="w-g" name="gender" defaultValue="FEMALE">
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
            </Select>
          </Field>
          <Field label="Age" htmlFor="w-age" error={errors.ageYears}>
            <Input id="w-age" name="ageYears" type="number" />
          </Field>
        </div>
        <Field label="Mobile" htmlFor="w-phone" error={errors.phone}>
          <Input id="w-phone" name="phone" type="tel" />
        </Field>
        <Field label="Email" htmlFor="w-email" optional error={errors.email}>
          <Input id="w-email" name="email" type="email" />
        </Field>
        {error && <Alert tone="error">{error}</Alert>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Spinner />} Register
          </Button>
        </div>
      </form>
    </Overlay>
  );
}

export function PatientProfile({ id }: { id: ID }) {
  const { notify } = useToast();
  const res = useAsync(() => api.admin.getPatient(id), [id]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  if (res.loading && !res.data) return <Skeleton className="h-96 rounded-2xl" />;
  if (!res.data) return <EmptyState title="Patient not found" action={<ButtonLink href={routes.admin.patients}>Back to patients</ButtonLink>} />;
  const { patient: p, appointments, payments } = res.data;

  async function addNote() {
    if (!note.trim()) return;
    setSaving(true);
    try {
      const updated = await api.admin.addPatientNote(p.id, note.trim());
      res.setData((prev) => (prev ? { ...prev, patient: updated } : prev!));
      setNote("");
      notify("Note added.");
    } catch (e) {
      notify(errorMessage(e), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <Link href={routes.admin.patients} className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
        <ArrowLeft className="size-4" /> Patients
      </Link>
      <PageTitle title={p.fullName} description={`${p.medicalRecordNo} · ${p.gender === "FEMALE" ? "Female" : "Male"} · ${p.ageYears ?? "—"} yrs · registered ${formatDate(p.registeredAt)}`} actions={<ButtonLink href={routes.admin.calendar}>Book appointment</ButtonLink>} />
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Appointment history</CardTitle>
            <span className="text-xs text-ink-soft">{appointments.length} total</span>
          </CardHeader>
          <div className="max-h-[28rem] divide-y divide-line overflow-y-auto">
            {appointments.length === 0 && <p className="p-5 text-sm text-ink-soft">No appointments yet.</p>}
            {appointments.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-3 text-sm">
                <span className="w-36 shrink-0 text-ink">
                  {formatDate(a.startsAt)} · {formatTime(a.startsAt)}
                </span>
                <span className="flex-1">{a.serviceName}</span>
                <span className="font-mono text-xs text-ink-soft">{a.reference}</span>
                <AppointmentStatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardBody className="space-y-1 text-sm">
              <p>
                <a className="text-teal" href={`tel:${p.phone}`}>
                  {p.phone}
                </a>
              </p>
              <p className="text-ink-soft">{p.email ?? "No email"}</p>
              <p className="text-ink-soft">Membership: {titleCase(p.membershipStatus === "NONE" ? "free account" : p.membershipStatus)}</p>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Internal notes</CardTitle>
              <Badge tone="outline">Staff only</Badge>
            </CardHeader>
            <CardBody className="space-y-3">
              <p className="text-xs text-ink-soft">Operational notes only. Clinical notes are restricted to treating practitioners and are audited.</p>
              <Textarea aria-label="New note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Prefers evening appointments" />
              <Button size="sm" onClick={addNote} disabled={saving || !note.trim()}>
                {saving && <Spinner />} Add note
              </Button>
              <ul className="space-y-2">
                {p.internalNotes.map((n) => (
                  <li key={n.id} className="rounded-lg bg-mist/60 p-3 text-sm">
                    <p className="text-ink">{n.body}</p>
                    <p className="mt-1 text-xs text-ink-soft">
                      {n.author} · {formatDate(n.at)}
                    </p>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
            </CardHeader>
            <ul className="divide-y divide-line text-sm">
              {payments.length === 0 && <li className="p-5 text-ink-soft">No payments recorded.</li>}
              {payments.map((pay) => (
                <li key={pay.id} className="flex justify-between px-5 py-2.5">
                  <span>
                    {formatDate(pay.createdAt)} <span className="text-xs text-ink-soft">{titleCase(pay.method)}</span>
                  </span>
                  <span className="font-semibold">{formatMoney(pay.amount)}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
