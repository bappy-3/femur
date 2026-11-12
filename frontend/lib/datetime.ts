/**
 * Date/time helpers for the clinic's business time zone (Asia/Dhaka).
 *
 * - Instants are ISO-8601 UTC strings (what the API sends/receives).
 * - Business dates are "YYYY-MM-DD" strings interpreted in Asia/Dhaka.
 * - Formatting is computed from Dhaka wall-clock parts (not the device zone, not Intl),
 *   so server and browser render identical strings regardless of the visitor's time zone.
 * - Arithmetic helpers (used by the mock scheduling adapter and calendar layout) rely on
 *   Dhaka's fixed UTC+06:00 offset (no DST since 2009). The backend uses a tz database.
 */
import type { ISODate, ISODateTime } from "@/types/common";

export const CLINIC_TIME_ZONE = "Asia/Dhaka";
const DHAKA_OFFSET_MINUTES = 6 * 60;
const MINUTE = 60_000;
const DAY = 24 * 60 * MINUTE;

const pad = (n: number) => String(n).padStart(2, "0");

function toDate(input: Date | string | number): Date {
  return input instanceof Date ? input : new Date(input);
}

/** Calendar parts of an instant as seen on a wall clock in Dhaka. */
export function dhakaParts(input: Date | string | number) {
  const shifted = new Date(toDate(input).getTime() + DHAKA_OFFSET_MINUTES * MINUTE);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
    weekday: shifted.getUTCDay(), // 0 = Sunday
  };
}

/** Dhaka calendar date ("YYYY-MM-DD") of an instant. */
export function toDhakaDate(input: Date | string | number): ISODate {
  const p = dhakaParts(input);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

export function dhakaToday(now: Date = new Date()): ISODate {
  return toDhakaDate(now);
}

/** "HH:mm" → minutes since midnight. */
export function parseTime(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

/** minutes since midnight → "HH:mm". */
export function minutesToTime(minutes: number): string {
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

/** Dhaka wall-clock date + minutes-of-day → UTC instant. */
export function dhakaDateTimeToUtc(date: ISODate, minutesOfDay: number): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + (minutesOfDay - DHAKA_OFFSET_MINUTES) * MINUTE);
}

/** Minutes since Dhaka midnight for an instant. */
export function dhakaMinutesOfDay(input: Date | string | number): number {
  const p = dhakaParts(input);
  return p.hour * 60 + p.minute;
}

export function addDays(date: ISODate, days: number): ISODate {
  const [y, m, d] = date.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d) + days * DAY);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

export function weekdayOf(date: ISODate): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Whole days from a to b (b - a). */
export function daysBetween(a: ISODate, b: ISODate): number {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / DAY);
}

/** Which occurrence of its weekday within the month the date is (1..5). */
export function nthWeekdayOfMonth(date: ISODate): number {
  const day = Number(date.split("-")[2]);
  return Math.floor((day - 1) / 7) + 1;
}

/** Start of the week containing `date`. Bangladesh weeks start on Saturday (6). */
export function startOfWeek(date: ISODate, weekStartsOn = 6): ISODate {
  const diff = (weekdayOf(date) - weekStartsOn + 7) % 7;
  return addDays(date, -diff);
}

export function addMinutes(iso: ISODateTime, minutes: number): ISODateTime {
  return new Date(new Date(iso).getTime() + minutes * MINUTE).toISOString();
}

export function minutesBetween(a: ISODateTime, b: ISODateTime): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / MINUTE);
}

/* ------------------------------------------------------------------ */
/* Formatting — deterministic (no Intl), always in clinic time zone.     */
/* Intl output differs between Node's ICU and browsers (e.g. commas),    */
/* which breaks React hydration, so we format from Dhaka parts instead.  */
/* ------------------------------------------------------------------ */

export const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] as const;

function dateParts(date: ISODate) {
  const [y, m, d] = date.split("-").map(Number);
  return { y, m, d, wd: weekdayOf(date) };
}

/** "09:00" → "9:00 am" for schedule displays. */
export function formatClock(hhmm: string): string {
  const total = parseTime(hhmm);
  const h = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${pad(m)} ${suffix}`;
}

export const formatTime = (iso: ISODateTime) => formatClock(minutesToTime(dhakaMinutesOfDay(iso)));
export const formatTimeRange = (start: ISODateTime, end: ISODateTime) => `${formatTime(start)} – ${formatTime(end)}`;
/** "Thu, 12 Nov" */
export const formatDayShort = (date: ISODate) => {
  const { m, d, wd } = dateParts(date);
  return `${WEEKDAY_NAMES[wd]!.slice(0, 3)}, ${d} ${MONTH_NAMES[m - 1]!.slice(0, 3)}`;
};
/** "Thursday, 12 November 2026" */
export const formatDayLong = (date: ISODate) => {
  const { y, m, d, wd } = dateParts(date);
  return `${WEEKDAY_NAMES[wd]}, ${d} ${MONTH_NAMES[m - 1]} ${y}`;
};
/** "November 2026" */
export const formatMonthYear = (date: ISODate) => {
  const { y, m } = dateParts(date);
  return `${MONTH_NAMES[m - 1]} ${y}`;
};
export const formatWeekday = (date: ISODate) => WEEKDAY_NAMES[weekdayOf(date)]!.slice(0, 3);
export const formatMonthShort = (date: ISODate) => MONTH_NAMES[dateParts(date).m - 1]!.slice(0, 3);
/** "12 Nov 2026" — accepts a business date or an instant. */
export const formatDate = (value: ISODateTime | ISODate) => {
  const { y, m, d } = dateParts(value.length === 10 ? value : toDhakaDate(value));
  return `${pad(d)} ${MONTH_NAMES[m - 1]!.slice(0, 3)} ${y}`;
};
