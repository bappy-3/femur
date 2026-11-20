"use client";

import { Pencil, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, Skeleton, Spinner } from "@/components/ui/feedback";
import { Field, Input, Select } from "@/components/ui/form";
import { Monogram } from "@/components/ui/monogram";
import { Overlay } from "@/components/ui/overlay";
import { useToast } from "@/components/ui/toast";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { titleCase } from "@/lib/strings";
import { api } from "@/services";
import type { SavedPatient } from "@/types/user";
import { fieldErrors, patientDetailsSchema } from "@/features/auth/schemas";

export function FamilyProfiles() {
  const { notify } = useToast();
  const { data, loading, setData } = useAsync(() => api.account.listPatients(), []);
  const [editing, setEditing] = useState<SavedPatient | "new" | null>(null);

  async function remove(p: SavedPatient) {
    if (!confirm(`Remove ${p.fullName} from your saved profiles?`)) return;
    try {
      await api.account.deletePatient(p.id);
      setData((prev) => (prev ?? []).filter((x) => x.id !== p.id));
      notify("Profile removed.");
    } catch (e) {
      notify(errorMessage(e), "error");
    }
  }

  return (
    <div>
      <PageTitle
        title="Family profiles"
        description="Save the people you book for, so booking takes seconds."
        actions={
          <Button onClick={() => setEditing("new")}>
            <UserPlus className="size-4" /> Add person
          </Button>
        }
      />
      {loading ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {(data ?? []).map((p) => (
            <article key={p.id} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4">
              <Monogram name={p.fullName} color={p.gender === "FEMALE" ? "#5E9B2B" : "#1B7452"} className="size-11 text-sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink">{p.fullName}</p>
                <p className="text-xs text-ink-soft">
                  {p.gender === "FEMALE" ? "Female" : "Male"} · {p.ageYears ?? "—"} yrs
                </p>
                <Badge tone={p.relationship === "SELF" ? "teal" : "outline"} className="mt-1.5">
                  {p.relationship === "SELF" ? "You" : titleCase(p.relationship)}
                </Badge>
              </div>
              <div className="flex gap-1">
                <button aria-label={`Edit ${p.fullName}`} onClick={() => setEditing(p)} className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-mist hover:text-teal">
                  <Pencil className="size-4" />
                </button>
                {p.relationship !== "SELF" && (
                  <button aria-label={`Remove ${p.fullName}`} onClick={() => remove(p)} className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-rose-soft hover:text-rose">
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {editing && (
        <ProfileDialog
          initial={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(p) => {
            setData((prev) => {
              const list = prev ?? [];
              return list.some((x) => x.id === p.id) ? list.map((x) => (x.id === p.id ? p : x)) : [...list, p];
            });
            notify("Profile saved.");
          }}
        />
      )}
    </div>
  );
}

function ProfileDialog({ initial, onClose, onSaved }: { initial: SavedPatient | null; onClose: () => void; onSaved: (p: SavedPatient) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = patientDetailsSchema.safeParse({ ...raw, relationship: initial?.relationship === "SELF" ? "SELF" : raw.relationship, reasonForVisit: "" });
    if (!parsed.success) return setErrors(fieldErrors(parsed.error));
    setErrors({});
    setPending(true);
    try {
      const { reasonForVisit: _ignored, ...rest } = parsed.data;
      void _ignored;
      onSaved(await api.account.savePatient({ ...rest, id: initial?.id, dateOfBirth: initial?.dateOfBirth ?? null }));
      onClose();
    } catch (err) {
      setFormError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Overlay open onClose={onClose} title={initial ? "Edit profile" : "Add a person"}>
      <form id="profile-form" onSubmit={submit} noValidate className="space-y-4">
        <Field label="Full name" htmlFor="p-name" error={errors.fullName}>
          <Input id="p-name" name="fullName" defaultValue={initial?.fullName} aria-invalid={!!errors.fullName} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Gender" htmlFor="p-gender">
            <Select id="p-gender" name="gender" defaultValue={initial?.gender ?? "FEMALE"}>
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
            </Select>
          </Field>
          <Field label="Age" htmlFor="p-age" error={errors.ageYears}>
            <Input id="p-age" name="ageYears" type="number" inputMode="numeric" defaultValue={initial?.ageYears ?? ""} aria-invalid={!!errors.ageYears} />
          </Field>
        </div>
        {initial?.relationship !== "SELF" && (
          <Field label="Relationship" htmlFor="p-rel">
            <Select id="p-rel" name="relationship" defaultValue={initial?.relationship ?? "CHILD"}>
              {["CHILD", "PARENT", "SPOUSE", "SIBLING", "OTHER"].map((r) => (
                <option key={r} value={r}>
                  {titleCase(r)}
                </option>
              ))}
            </Select>
          </Field>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mobile number" htmlFor="p-phone" error={errors.phone}>
            <Input id="p-phone" name="phone" type="tel" defaultValue={initial?.phone} aria-invalid={!!errors.phone} />
          </Field>
          <Field label="Email" htmlFor="p-email" optional error={errors.email}>
            <Input id="p-email" name="email" type="email" defaultValue={initial?.email ?? ""} />
          </Field>
        </div>
        {formError && <Alert tone="error">{formError}</Alert>}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Spinner />} Save
          </Button>
        </div>
      </form>
    </Overlay>
  );
}
