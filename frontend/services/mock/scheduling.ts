/**
 * Simplified scheduling engine for MOCK MODE ONLY.
 * Mirrors docs/architecture/BOOKING_ENGINE.md so the UI behaves realistically before the backend exists.
 * The backend implementation is authoritative; never rely on this in production.
 */
import { addDays, daysBetween, dhakaDateTimeToUtc, dhakaMinutesOfDay, dhakaToday, nthWeekdayOfMonth, parseTime, toDhakaDate, weekdayOf } from "@/lib/datetime";
import { ACTIVE_STATUSES, type Appointment, type AvailabilitySlot } from "@/types/appointment";
import type { Service } from "@/types/catalog";
import type { Gender, ID, ISODate } from "@/types/common";
import type { AvailabilityRule, Practitioner, TimeBlock } from "@/types/practitioner";

/** Minutes-of-day interval, end exclusive. */
export interface Interval {
  start: number;
  end: number;
}

export function ruleAppliesOn(rule: AvailabilityRule, date: ISODate): boolean {
  if (date < rule.effectiveFrom) return false;
  if (rule.effectiveTo && date >= rule.effectiveTo) return false;
  const wd = weekdayOf(date);
  switch (rule.kind) {
    case "WEEKLY":
      return rule.weekdays.includes(wd);
    case "EVERY_N_WEEKS": {
      if (wd !== rule.weekday) return false;
      const diff = daysBetween(rule.anchorDate, date);
      return diff >= 0 && (diff / 7) % rule.intervalWeeks === 0;
    }
    case "MONTHLY_NTH_WEEKDAY":
      return wd === rule.weekday && rule.nth.includes(nthWeekdayOfMonth(date));
    case "SPECIFIC_DATE":
      return rule.date === date;
  }
}

export function mergeIntervals(list: Interval[]): Interval[] {
  const sorted = [...list].filter((i) => i.end > i.start).sort((a, b) => a.start - b.start);
  const out: Interval[] = [];
  for (const cur of sorted) {
    const last = out[out.length - 1];
    if (last && cur.start <= last.end) last.end = Math.max(last.end, cur.end);
    else out.push({ ...cur });
  }
  return out;
}

export function subtractIntervals(base: Interval[], remove: Interval[]): Interval[] {
  let result = mergeIntervals(base);
  for (const r of mergeIntervals(remove)) {
    const next: Interval[] = [];
    for (const b of result) {
      if (r.end <= b.start || r.start >= b.end) {
        next.push(b);
        continue;
      }
      if (r.start > b.start) next.push({ start: b.start, end: r.start });
      if (r.end < b.end) next.push({ start: r.end, end: b.end });
    }
    result = next;
  }
  return result;
}

/** Working intervals of a practitioner on a Dhaka date (rules minus breaks). */
export function workingIntervals(p: Practitioner, date: ISODate): Interval[] {
  if (!p.isActive) return [];
  const intervals: Interval[] = [];
  for (const rule of p.rules) {
    if (!ruleAppliesOn(rule, date)) continue;
    const base = [{ start: parseTime(rule.start), end: parseTime(rule.end) }];
    const breaks = rule.breaks.map((b) => ({ start: parseTime(b.start), end: parseTime(b.end) }));
    intervals.push(...subtractIntervals(base, breaks));
  }
  return mergeIntervals(intervals);
}

/** Busy intervals on a date from active appointments and time blocks. */
export function busyIntervals(practitionerId: ID, date: ISODate, appointments: Appointment[], blocks: TimeBlock[]): Interval[] {
  const busy: Interval[] = [];
  for (const a of appointments) {
    if (a.assignedPractitionerId !== practitionerId || !ACTIVE_STATUSES.includes(a.status)) continue;
    if (toDhakaDate(a.startsAt) !== date) continue;
    busy.push({ start: dhakaMinutesOfDay(a.startsAt), end: dhakaMinutesOfDay(a.endsAt) || 24 * 60 });
  }
  for (const b of blocks) {
    if (b.practitionerId !== null && b.practitionerId !== practitionerId) continue;
    if (toDhakaDate(b.startsAt) !== date) continue;
    busy.push({ start: dhakaMinutesOfDay(b.startsAt), end: dhakaMinutesOfDay(b.endsAt) || 24 * 60 });
  }
  return busy;
}

/** Candidate start minutes inside free intervals. */
export function slotStarts(free: Interval[], duration: number, step: number): number[] {
  const starts: number[] = [];
  for (const f of free) {
    for (let t = f.start; t + duration <= f.end; t += step) starts.push(t);
  }
  return starts;
}

/** Practitioners eligible for a service + patient gender, applying the service's gender policy. */
export function candidatePractitioners(service: Service, gender: Gender, practitioners: Practitioner[]): Practitioner[] {
  const { eligibleGenders, genderPolicy } = service.rules;
  if (eligibleGenders.length > 0 && !eligibleGenders.includes(gender)) return [];
  const offering = practitioners.filter((p) => p.isActive && p.serviceIds.includes(service.id));
  if (genderPolicy === "NONE") return offering;
  const same = offering.filter((p) => p.gender === gender);
  if (genderPolicy === "REQUIRED_SAME_GENDER") return same;
  return same.length > 0 ? same : offering; // PREFERRED
}

export interface SlotContext {
  service: Service;
  gender: Gender;
  date: ISODate;
  practitioners: Practitioner[];
  appointments: Appointment[];
  blocks: TimeBlock[];
  now: Date;
}

export interface ComputedSlot extends AvailabilitySlot {
  practitionerIds: ID[];
}

export function computeSlots(ctx: SlotContext): ComputedSlot[] {
  const { service, gender, date, now } = ctx;
  const today = dhakaToday(now);
  if (date < today || daysBetween(today, date) > service.rules.maxDaysAhead) return [];
  const earliest = now.getTime() + service.rules.minLeadMinutes * 60_000;
  const duration = service.rules.durationMinutes;
  const step = duration + service.rules.bufferMinutes;

  const byStart = new Map<number, ID[]>();
  for (const p of candidatePractitioners(service, gender, ctx.practitioners)) {
    const free = subtractIntervals(workingIntervals(p, date), busyIntervals(p.id, date, ctx.appointments, ctx.blocks));
    for (const start of slotStarts(free, duration, step)) {
      if (dhakaDateTimeToUtc(date, start).getTime() < earliest) continue;
      byStart.set(start, [...(byStart.get(start) ?? []), p.id]);
    }
  }
  return [...byStart.entries()]
    .sort(([a], [b]) => a - b)
    .map(([start, ids]) => ({
      startsAt: dhakaDateTimeToUtc(date, start).toISOString(),
      endsAt: dhakaDateTimeToUtc(date, start + duration).toISOString(),
      availableCount: ids.length,
      practitionerIds: ids,
    }));
}

/** Auto-assignment: least-loaded practitioner that day; ties → original order (deterministic). */
export function pickPractitioner(candidateIds: ID[], date: ISODate, appointments: Appointment[]): ID | null {
  if (candidateIds.length === 0) return null;
  const load = (id: ID) =>
    appointments.filter((a) => a.assignedPractitionerId === id && ACTIVE_STATUSES.includes(a.status) && toDhakaDate(a.startsAt) === date).length;
  return [...candidateIds].sort((a, b) => load(a) - load(b) || candidateIds.indexOf(a) - candidateIds.indexOf(b))[0]!;
}

/** True if [start,end) overlaps an active appointment or block for the practitioner. */
export function hasConflict(practitionerId: ID, startsAt: string, endsAt: string, appointments: Appointment[], blocks: TimeBlock[], ignoreId?: ID): boolean {
  const s = new Date(startsAt).getTime();
  const e = new Date(endsAt).getTime();
  const overlaps = (a: string, b: string) => new Date(a).getTime() < e && new Date(b).getTime() > s;
  return (
    appointments.some((a) => a.id !== ignoreId && a.assignedPractitionerId === practitionerId && ACTIVE_STATUSES.includes(a.status) && overlaps(a.startsAt, a.endsAt)) ||
    blocks.some((b) => (b.practitionerId === null || b.practitionerId === practitionerId) && overlaps(b.startsAt, b.endsAt))
  );
}

export function dateRange(from: ISODate, days: number): ISODate[] {
  return Array.from({ length: days }, (_, i) => addDays(from, i));
}
