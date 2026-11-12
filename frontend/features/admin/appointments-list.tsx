"use client";

import { Download, Search } from "lucide-react";
import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { Button } from "@/components/ui/button";
import { Alert, EmptyState, Skeleton } from "@/components/ui/feedback";
import { Input, Select } from "@/components/ui/form";
import { AppointmentStatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useAsync } from "@/hooks/use-async";
import { STATUS_META } from "@/lib/appointment-status";
import { downloadCsv } from "@/lib/csv";
import { formatDate, formatTime } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import { maskPhone, titleCase } from "@/lib/strings";
import { api } from "@/services";
import type { Appointment, AppointmentStatus } from "@/types/appointment";
import { AppointmentDrawer } from "@/features/admin-calendar/appointment-drawer";
import { DateRangeFilter, PRESETS, type Range } from "./date-range";

export function AppointmentsList() {
  const { notify } = useToast();
  const [range, setRange] = useState<Range>(PRESETS[3].range());
  const [status, setStatus] = useState<AppointmentStatus | "">("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Appointment | null>(null);
  const list = useAsync(() => api.admin.listAppointments({ ...range, status, q }), [range.from, range.to, status, q]);
  const practitioners = useAsync(() => api.admin.listPractitioners(), []);
  const nameOf = (id: string | null) => practitioners.data?.find((p) => p.id === id)?.displayName ?? "—";
  const rows = list.data ?? [];

  function exportCsv() {
    downloadCsv(`appointments_${range.from}_${range.to}.csv`, [
      ["Reference", "Date", "Time", "Patient", "Service", "Assigned", "Treating", "Status", "Source", "Net fee (BDT)", "Payment"],
      ...rows.map((a) => [a.reference, formatDate(a.startsAt), formatTime(a.startsAt), a.patient.fullName, a.serviceName, nameOf(a.assignedPractitionerId), nameOf(a.treatingPractitionerId), a.status, a.source, a.charge.net ? a.charge.net.amount / 100 : "", a.charge.paymentStatus]),
    ]);
  }

  return (
    <div className="space-y-5">
      <PageTitle
        title="Appointments"
        description="Search, review and update bookings."
        actions={
          <Button variant="secondary" onClick={exportCsv} disabled={rows.length === 0}>
            <Download className="size-4" /> Export CSV
          </Button>
        }
      />
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <DateRangeFilter value={range} onChange={setRange} presets={["today", "7d", "next7"]} />
        <div className="flex flex-1 gap-2">
          <Select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value as AppointmentStatus | "")} className="h-9 w-auto rounded-full text-sm">
            <option value="">All statuses</option>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Select>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-soft" />
            <Input aria-label="Search" placeholder="Patient, phone or reference" value={q} onChange={(e) => setQ(e.target.value)} className="h-9 rounded-full pl-9 text-sm" />
          </div>
        </div>
      </div>
      {list.error && <Alert tone="error">{list.error}</Alert>}
      {list.loading && !list.data ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : rows.length === 0 ? (
        <EmptyState title="No appointments match these filters" />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[56rem] text-sm">
            <thead className="bg-mist/60 text-left text-xs tracking-wide text-ink-soft uppercase">
              <tr>
                {["When", "Patient", "Service", "Practitioner", "Status", "Source", "Fee"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((a) => (
                <tr key={a.id} onClick={() => setSelected(a)} className="cursor-pointer hover:bg-mist/40">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold text-ink">{formatTime(a.startsAt)}</span> <span className="text-ink-soft">{formatDate(a.startsAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-ink">{a.patient.fullName}</span>
                    <span className="block text-xs text-ink-soft">{maskPhone(a.patient.phone)}</span>
                  </td>
                  <td className="px-4 py-3">{a.serviceName}</td>
                  <td className="px-4 py-3">{nameOf(a.assignedPractitionerId)}</td>
                  <td className="px-4 py-3">
                    <AppointmentStatusBadge status={a.status} />
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{titleCase(a.source)}</td>
                  <td className="px-4 py-3">{formatMoney(a.charge.net, "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-line px-4 py-2.5 text-xs text-ink-soft">{rows.length} appointments</p>
        </div>
      )}
      <AppointmentDrawer
        key={selected ? `${selected.id}-${selected.status}-${selected.startsAt}` : "none"}
        appointment={selected}
        practitioners={practitioners.data ?? []}
        onClose={() => setSelected(null)}
        onChanged={(a, message) => {
          list.setData((prev) => (prev ?? []).map((x) => (x.id === a.id ? a : x)));
          setSelected(a);
          notify(message);
        }}
      />
    </div>
  );
}
