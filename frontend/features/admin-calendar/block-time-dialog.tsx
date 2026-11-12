"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, Spinner } from "@/components/ui/feedback";
import { Field, Input, Select } from "@/components/ui/form";
import { Overlay } from "@/components/ui/overlay";
import { errorMessage } from "@/hooks/use-async";
import { dhakaDateTimeToUtc, parseTime } from "@/lib/datetime";
import { api } from "@/services";
import type { ISODate } from "@/types/common";
import type { Practitioner, TimeBlock } from "@/types/practitioner";

export function BlockTimeDialog({ open, date, practitioners, onClose, onCreated }: { open: boolean; date: ISODate; practitioners: Practitioner[]; onClose: () => void; onCreated: (b: TimeBlock) => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!open) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const d = String(fd.get("date"));
    const start = String(fd.get("start"));
    const end = String(fd.get("end"));
    const reason = String(fd.get("reason")).trim();
    const pid = String(fd.get("practitionerId"));
    if (!d || !start || !end || parseTime(end) <= parseTime(start)) return setError("End time must be after start time.");
    if (!reason) return setError("Please give a reason (shown on the calendar).");
    setPending(true);
    setError(null);
    try {
      onCreated(
        await api.admin.createBlock({
          practitionerId: pid === "ALL" ? null : pid,
          startsAt: dhakaDateTimeToUtc(d, parseTime(start)).toISOString(),
          endsAt: dhakaDateTimeToUtc(d, parseTime(end)).toISOString(),
          reason,
        }),
      );
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  }

  return (
    <Overlay open onClose={onClose} title="Block time" description="Blocked time is removed from online availability immediately.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Who" htmlFor="bt-p">
          <Select id="bt-p" name="practitionerId" defaultValue="ALL">
            <option value="ALL">Whole clinic</option>
            {practitioners.map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Field label="Date" htmlFor="bt-d" className="col-span-2 sm:col-span-1">
            <Input id="bt-d" name="date" type="date" defaultValue={date} />
          </Field>
          <Field label="From" htmlFor="bt-s">
            <Input id="bt-s" name="start" type="time" step={900} defaultValue="13:00" />
          </Field>
          <Field label="To" htmlFor="bt-e">
            <Input id="bt-e" name="end" type="time" step={900} defaultValue="14:00" />
          </Field>
        </div>
        <Field label="Reason" htmlFor="bt-r">
          <Input id="bt-r" name="reason" placeholder="e.g. Staff training, equipment maintenance" />
        </Field>
        {error && <Alert tone="error">{error}</Alert>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Spinner />} Block time
          </Button>
        </div>
      </form>
    </Overlay>
  );
}
