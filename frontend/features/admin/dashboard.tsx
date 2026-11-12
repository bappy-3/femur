"use client";

import { AlertTriangle, CalendarCheck2, CalendarClock, CircleDollarSign, Clock4, UserRoundCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageTitle } from "@/components/layout/portal-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, Skeleton } from "@/components/ui/feedback";
import { AppointmentStatusBadge } from "@/components/ui/status-badge";
import { routes } from "@/config/site";
import { useAsync } from "@/hooks/use-async";
import { dhakaToday, formatDayShort, formatTime } from "@/lib/datetime";
import { formatMoney } from "@/lib/money";
import { api } from "@/services";
import { DateRangeFilter, PRESETS, type Range } from "./date-range";

function Stat({ label, value, Icon, hint, href }: { label: string; value: string | number; Icon: typeof Clock4; hint?: string; href?: string }) {
  const body = (
    <Card className="h-full transition-colors hover:border-sage/50">
      <CardBody className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{label}</p>
          <p className="mt-2 font-display text-[2rem] leading-none text-teal-deep">{value}</p>
          {hint && <p className="mt-1.5 text-xs text-ink-soft">{hint}</p>}
        </div>
        <Icon className="size-5 text-sage" />
      </CardBody>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

/** Single-series daily revenue bars (one hue, rounded data-ends, 2px gaps, hover tooltip). */
function RevenueBars({ data }: { data: { date: string; amount: number }[] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.amount));
  const h = 160;
  return (
    <div className="relative">
      <div className="flex h-[160px] items-end gap-[2px] border-b border-line" role="img" aria-label="Daily revenue">
        {data.map((d, i) => (
          <div key={d.date} className="group relative flex h-full flex-1 items-end" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <div className="w-full rounded-t-[4px] bg-teal transition-opacity" style={{ height: Math.max(d.amount ? 3 : 0, (d.amount / max) * h), opacity: hover === null || hover === i ? 1 : 0.45 }} />
          </div>
        ))}
      </div>
      {hover !== null && data[hover] && (
        <div className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs shadow-[var(--shadow-soft)]" style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}>
          <p className="text-ink-soft">{formatDayShort(data[hover].date)}</p>
          <p className="font-semibold text-ink">{formatMoney({ amount: data[hover].amount, currency: "BDT" })}</p>
        </div>
      )}
      <div className="mt-1.5 flex justify-between text-[0.68rem] text-ink-soft">
        <span>{data[0] && formatDayShort(data[0].date)}</span>
        <span>{data.at(-1) && formatDayShort(data.at(-1)!.date)}</span>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [range, setRange] = useState<Range>(PRESETS[2].range());
  const summary = useAsync(() => api.admin.dashboard(range), [range.from, range.to]);
  const today = useAsync(() => api.admin.listAppointments({ from: dhakaToday(), to: dhakaToday() }), []);
  const practitioners = useAsync(() => api.admin.listPractitioners(), []);
  const s = summary.data;
  const nameOf = (id: string) => practitioners.data?.find((p) => p.id === id)?.displayName ?? "";
  const maxService = Math.max(1, ...(s?.appointmentsByService.map((x) => x.count) ?? [1]));

  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard" description="Clinic activity at a glance." actions={<ButtonLink href={routes.admin.calendar}>Open calendar</ButtonLink>} />
      <DateRangeFilter value={range} onChange={setRange} />
      {summary.error && <Alert tone="error">{summary.error}</Alert>}

      {!s ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Today's appointments" value={s.todayCount} Icon={CalendarClock} href={routes.admin.calendar} />
          <Stat label="Upcoming" value={s.upcomingCount} Icon={CalendarCheck2} hint="Pending + confirmed, after today" />
          <Stat label="Pending approval" value={s.pendingCount} Icon={Clock4} href={routes.admin.appointments} hint="Needs reception action" />
          <Stat label="Completed sessions" value={s.completedCount} Icon={UserRoundCheck} hint="In selected range" />
          <Stat label="Revenue" value={formatMoney(s.revenue)} Icon={CircleDollarSign} hint="Verified payments in range" />
          <Stat label="Outstanding" value={formatMoney(s.outstanding)} Icon={AlertTriangle} hint="Completed but unpaid" href={routes.admin.finance} />
          <Stat label="Cancelled / no-show" value={s.cancelledCount} Icon={XCircle} hint="In selected range" />
          <Stat label="Active memberships" value={s.activeMemberships} Icon={UserRoundCheck} href={routes.admin.pricing} />
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Daily revenue</CardTitle>
            <span className="text-xs text-ink-soft">Verified payments</span>
          </CardHeader>
          <CardBody>{s ? <RevenueBars data={s.revenueByDay} /> : <Skeleton className="h-40" />}</CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appointments by service</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2.5">
            {s?.appointmentsByService.slice(0, 7).map((row) => (
              <div key={row.serviceName} className="grid grid-cols-[9.5rem_1fr_2rem] items-center gap-3 text-sm" title={`${row.serviceName}: ${row.count}`}>
                <span className="truncate text-ink">{row.serviceName}</span>
                <span className="h-2.5 rounded-r-[4px] bg-sage" style={{ width: `${(row.count / maxService) * 100}%` }} />
                <span className="text-right font-semibold text-ink">{row.count}</span>
              </div>
            )) ?? <Skeleton className="h-40" />}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Today</CardTitle>
            <Link href={routes.admin.calendar} className="text-sm font-semibold text-teal">
              Calendar →
            </Link>
          </CardHeader>
          <div className="max-h-96 divide-y divide-line overflow-y-auto">
            {today.loading && <Skeleton className="m-5 h-32" />}
            {(today.data ?? []).length === 0 && !today.loading && <p className="p-5 text-sm text-ink-soft">No appointments today.</p>}
            {(today.data ?? []).map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                <span className="w-16 shrink-0 font-semibold text-ink">{formatTime(a.startsAt)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-ink">{a.patient.fullName}</span>
                  <span className="block truncate text-xs text-ink-soft">
                    {a.serviceName} · {nameOf(a.assignedPractitionerId)}
                  </span>
                </span>
                <AppointmentStatusBadge status={a.status} />
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Practitioner workload</CardTitle>
            <span className="text-xs text-ink-soft">In range</span>
          </CardHeader>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-ink-soft">
              <tr>
                <th className="px-5 py-2 font-semibold">Practitioner</th>
                <th className="px-2 py-2 text-right font-semibold">Completed</th>
                <th className="px-5 py-2 text-right font-semibold">Scheduled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {s?.practitionerLoad.map((p) => (
                <tr key={p.practitionerId}>
                  <td className="px-5 py-2.5 text-ink">{p.name}</td>
                  <td className="px-2 py-2.5 text-right font-semibold">{p.completed}</td>
                  <td className="px-5 py-2.5 text-right text-ink-soft">{p.scheduled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
