"use client";

import { Ban, CalendarPlus, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, Skeleton, Spinner } from "@/components/ui/feedback";
import { Checkbox, Select } from "@/components/ui/form";
import { Overlay } from "@/components/ui/overlay";
import { useToast } from "@/components/ui/toast";
import { errorMessage, useAsync } from "@/hooks/use-async";
import { cn } from "@/lib/cn";
import { addDays, dhakaToday, formatDayLong, formatDayShort, formatTime, startOfWeek, toDhakaDate } from "@/lib/datetime";
import { api } from "@/services";
import type { Appointment } from "@/types/appointment";
import type { ID, ISODate } from "@/types/common";
import { AppointmentDrawer } from "./appointment-drawer";
import { BlockTimeDialog } from "./block-time-dialog";
import { DayGrid } from "./day-grid";
import { NewAppointmentDialog } from "./new-appointment-dialog";
import { LEGEND } from "./status-style";
import { WeekGrid } from "./week-grid";

type View = "day" | "week";
type Team = "all" | "physio" | "visiting" | ID;

export function AdminCalendar() {
  const { notify } = useToast();
  const [view, setView] = useState<View>("day");
  const [date, setDate] = useState<ISODate>(dhakaToday());
  const [team, setTeam] = useState<Team>("all");
  const [serviceId, setServiceId] = useState<ID | "">("");
  const [showCancelled, setShowCancelled] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [creating, setCreating] = useState<{ practitionerId: ID; startsAt: string } | null | "blank">(null);
  const [blocking, setBlocking] = useState(false);
  const [moving, setMoving] = useState<{ appointment: Appointment; practitionerId: ID; startsAt: string } | null>(null);
  const [movePending, setMovePending] = useState(false);

  const services = useAsync(() => api.admin.listServices(), []);
  const allPractitioners = useAsync(() => api.admin.listPractitioners(), []);
  const rangeStart = view === "day" ? date : startOfWeek(date);
  const practitionerIds =
    team === "all" ? undefined : team === "physio" || team === "visiting" ? (allPractitioners.data ?? []).filter((p) => p.isVisiting === (team === "visiting")).map((p) => p.id) : [team];
  const cal = useAsync(
    () => api.admin.calendar({ date: rangeStart, days: view === "day" ? 1 : 7, practitionerIds, serviceId: serviceId || null }),
    [rangeStart, view, team, serviceId, allPractitioners.data?.length],
  );

  const step = view === "day" ? 1 : 7;
  const label = view === "day" ? formatDayLong(date) : `${formatDayShort(rangeStart)} – ${formatDayShort(addDays(rangeStart, 6))}`;
  const practitioners = cal.data?.practitioners ?? [];

  function upsertLocal(a: Appointment) {
    cal.setData((prev) => (prev ? { ...prev, appointments: prev.appointments.some((x) => x.id === a.id) ? prev.appointments.map((x) => (x.id === a.id ? a : x)) : [...prev.appointments, a] } : prev!));
  }

  async function confirmMove() {
    if (!moving) return;
    setMovePending(true);
    try {
      const updated = await api.admin.reschedule(moving.appointment.id, { startsAt: moving.startsAt, practitionerId: moving.practitionerId });
      upsertLocal(updated);
      notify(`Moved ${updated.patient.fullName} to ${formatTime(updated.startsAt)}.`);
      setMoving(null);
    } catch (e) {
      notify(errorMessage(e), "error");
    } finally {
      setMovePending(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center rounded-full border border-line bg-white">
            <button aria-label="Previous" onClick={() => setDate(addDays(date, -step))} className="grid size-9 place-items-center rounded-full hover:bg-mist">
              <ChevronLeft className="size-4" />
            </button>
            <button onClick={() => setDate(dhakaToday())} className="px-2 text-sm font-semibold text-teal">
              Today
            </button>
            <button aria-label="Next" onClick={() => setDate(addDays(date, step))} className="grid size-9 place-items-center rounded-full hover:bg-mist">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <input type="date" aria-label="Go to date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} className="h-9 rounded-full border border-line bg-white px-3 text-sm" />
          <h2 className="ml-1 font-display text-xl text-teal-deep">{label}</h2>
          {cal.loading && <Spinner className="text-sage" />}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="tablist" aria-label="View" className="inline-flex rounded-full border border-line bg-white p-1">
            {(["day", "week"] as const).map((v) => (
              <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={cn("rounded-full px-3.5 py-1 text-sm font-medium capitalize", view === v ? "bg-teal text-white" : "text-ink-soft")}>
                {v}
              </button>
            ))}
          </div>
          <Select aria-label="Filter practitioners" value={team} onChange={(e) => setTeam(e.target.value)} className="h-9 w-auto min-w-44 rounded-full text-sm">
            <option value="all">All practitioners</option>
            <option value="physio">Physiotherapy team</option>
            <option value="visiting">Visiting specialists</option>
            {(allPractitioners.data ?? []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.displayName}
              </option>
            ))}
          </Select>
          <Select aria-label="Filter service" value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="h-9 w-auto min-w-40 rounded-full text-sm">
            <option value="">All services</option>
            {(services.data ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Button size="sm" variant="secondary" onClick={() => setBlocking(true)}>
            <Ban className="size-4" /> Block time
          </Button>
          <Button size="sm" onClick={() => setCreating("blank")}>
            <CalendarPlus className="size-4" /> New appointment
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft">
        {LEGEND.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span className={cn("size-3 rounded-sm border", l.className)} /> {l.label}
          </span>
        ))}
        <Checkbox label="Show cancelled" checked={showCancelled} onChange={(e) => setShowCancelled(e.target.checked)} className="ml-auto text-xs" />
        <button onClick={cal.reload} className="inline-flex items-center gap-1 font-semibold text-teal">
          <RefreshCw className="size-3.5" /> Refresh
        </button>
      </div>

      {cal.error && <Alert tone="error">{cal.error}</Alert>}
      {!cal.data ? (
        <Skeleton className="h-[32rem] rounded-2xl" />
      ) : practitioners.length === 0 ? (
        <Alert tone="info">No practitioners match these filters.</Alert>
      ) : view === "day" ? (
        <DayGrid
          data={cal.data}
          date={date}
          showCancelled={showCancelled}
          onSelect={setSelected}
          onCreateAt={(practitionerId, startsAt) => setCreating({ practitionerId, startsAt })}
          onMove={(appointment, practitionerId, startsAt) => {
            if (appointment.startsAt === startsAt && appointment.assignedPractitionerId === practitionerId) return;
            setMoving({ appointment, practitionerId, startsAt });
          }}
        />
      ) : (
        <WeekGrid
          data={cal.data}
          weekStart={rangeStart}
          showCancelled={showCancelled}
          onSelect={setSelected}
          onOpenDay={(d) => {
            setDate(d);
            setView("day");
          }}
        />
      )}
      <p className="text-xs text-ink-soft">Tip: click an empty slot to book, click a booking for details, or drag a pending/confirmed booking to move it. The server validates every change.</p>

      <AppointmentDrawer
        key={selected ? `${selected.id}-${selected.startsAt}-${selected.status}` : "none"}
        appointment={selected}
        practitioners={allPractitioners.data ?? []}
        onClose={() => setSelected(null)}
        onChanged={(a, message) => {
          upsertLocal(a);
          setSelected(a);
          notify(message);
          if (toDhakaDate(a.startsAt) !== date && view === "day") cal.reload();
        }}
      />
      {creating && (
        <NewAppointmentDialog
          key={creating === "blank" ? "blank" : `${creating.practitionerId}-${creating.startsAt}`}
          open
          initial={creating === "blank" ? { practitionerId: practitioners[0]?.id ?? "", startsAt: `${date}T04:00:00.000Z` } : creating}
          practitioners={allPractitioners.data ?? []}
          services={services.data ?? []}
          onClose={() => setCreating(null)}
          onCreated={(a) => {
            upsertLocal(a);
            notify(`Booked ${a.patient.fullName} · ${a.reference}`);
          }}
        />
      )}
      <BlockTimeDialog
        open={blocking}
        date={date}
        practitioners={allPractitioners.data ?? []}
        onClose={() => setBlocking(false)}
        onCreated={(b) => {
          cal.setData((prev) => (prev ? { ...prev, blocks: [...prev.blocks, b] } : prev!));
          notify("Time blocked.");
        }}
      />
      <Overlay
        open={!!moving}
        onClose={() => setMoving(null)}
        title="Move appointment?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setMoving(null)}>
              Cancel
            </Button>
            <Button onClick={confirmMove} disabled={movePending}>
              {movePending && <Spinner />} Move
            </Button>
          </>
        }
      >
        {moving && (
          <p className="text-sm text-ink">
            Move <strong>{moving.appointment.patient.fullName}</strong> ({moving.appointment.serviceName}) to{" "}
            <strong>{(allPractitioners.data ?? []).find((p) => p.id === moving.practitionerId)?.displayName}</strong> at <strong>{formatTime(moving.startsAt)}</strong>?
            <span className="mt-2 block text-ink-soft">The patient should be informed of the change.</span>
          </p>
        )}
      </Overlay>
    </div>
  );
}
