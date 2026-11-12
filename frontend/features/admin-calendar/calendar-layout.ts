/**
 * Pure layout math for the resource calendar (unit tested).
 * Vertical axis = minutes since Dhaka midnight; horizontal lanes resolve overlaps inside one column.
 */
import { dhakaMinutesOfDay, parseTime } from "@/lib/datetime";

export const SLOT_MINUTES = 15;
export const ROW_PX = 18; // height of one 15-minute row → 72px per hour

export interface TimedItem {
  id: string;
  startsAt: string;
  endsAt: string;
}

export interface PositionedItem<T extends TimedItem> {
  item: T;
  top: number;
  height: number;
  lane: number;
  lanes: number;
}

export function minutesToPx(minutes: number, dayStartMinutes: number): number {
  return ((minutes - dayStartMinutes) / SLOT_MINUTES) * ROW_PX;
}

export function pxToMinutes(px: number, dayStartMinutes: number, snap = SLOT_MINUTES): number {
  const raw = dayStartMinutes + (px / ROW_PX) * SLOT_MINUTES;
  return Math.max(dayStartMinutes, Math.floor(raw / snap) * snap);
}

export function timeRows(start: string, end: string, step = SLOT_MINUTES): number[] {
  const rows: number[] = [];
  for (let m = parseTime(start); m < parseTime(end); m += step) rows.push(m);
  return rows;
}

/**
 * Position items in a single column. Overlapping items (e.g. a cancelled booking under a new one)
 * are split into side-by-side lanes so nothing is hidden.
 */
export function layoutColumn<T extends TimedItem>(items: T[], dayStartMinutes: number): PositionedItem<T>[] {
  const sorted = [...items].sort((a, b) => a.startsAt.localeCompare(b.startsAt) || b.endsAt.localeCompare(a.endsAt));
  const result: PositionedItem<T>[] = [];
  let cluster: PositionedItem<T>[] = [];
  let clusterEnd = -Infinity;
  const laneEnds: number[] = [];

  const flush = () => {
    const lanes = Math.max(1, ...cluster.map((c) => c.lane + 1));
    cluster.forEach((c) => (c.lanes = lanes));
    result.push(...cluster);
    cluster = [];
    laneEnds.length = 0;
  };

  for (const item of sorted) {
    const start = dhakaMinutesOfDay(item.startsAt);
    const end = dhakaMinutesOfDay(item.endsAt) || 24 * 60;
    if (start >= clusterEnd) flush();
    let lane = laneEnds.findIndex((e) => e <= start);
    if (lane === -1) lane = laneEnds.length;
    laneEnds[lane] = end;
    clusterEnd = Math.max(clusterEnd === -Infinity ? end : clusterEnd, end);
    cluster.push({
      item,
      top: minutesToPx(start, dayStartMinutes),
      height: Math.max(ROW_PX, minutesToPx(end, dayStartMinutes) - minutesToPx(start, dayStartMinutes)),
      lane,
      lanes: 1,
    });
  }
  flush();
  return result;
}

/** True when [startMin, startMin+duration) fits inside one of the working ranges. */
export function fitsWorkingRanges(ranges: { start: string; end: string }[], startMin: number, duration: number): boolean {
  return ranges.some((r) => startMin >= parseTime(r.start) && startMin + duration <= parseTime(r.end));
}
