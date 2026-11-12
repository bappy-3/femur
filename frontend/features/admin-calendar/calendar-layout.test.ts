import { describe, expect, it } from "vitest";
import { dhakaDateTimeToUtc } from "@/lib/datetime";
import { fitsWorkingRanges, layoutColumn, minutesToPx, pxToMinutes, ROW_PX } from "./calendar-layout";

const item = (id: string, start: number, end: number) => ({
  id,
  startsAt: dhakaDateTimeToUtc("2026-11-12", start).toISOString(),
  endsAt: dhakaDateTimeToUtc("2026-11-12", end).toISOString(),
});

describe("calendar layout", () => {
  it("maps minutes to pixels and snaps back to 15-minute slots", () => {
    expect(minutesToPx(600, 540)).toBe(4 * ROW_PX);
    expect(pxToMinutes(4 * ROW_PX + 5, 540)).toBe(600);
    expect(pxToMinutes(-50, 540)).toBe(540);
  });

  it("gives non-overlapping items a full-width single lane", () => {
    const out = layoutColumn([item("a", 540, 585), item("b", 585, 630)], 540);
    expect(out.map((o) => [o.lane, o.lanes])).toEqual([
      [0, 1],
      [0, 1],
    ]);
  });

  it("splits overlapping items into side-by-side lanes", () => {
    const out = layoutColumn([item("a", 540, 600), item("b", 555, 615), item("c", 620, 650)], 540);
    const byId = Object.fromEntries(out.map((o) => [o.item.id, o]));
    expect(byId.a!.lanes).toBe(2);
    expect(byId.b!.lane).toBe(1);
    expect(byId.c!.lanes).toBe(1);
  });

  it("checks whether a booking fits inside working hours", () => {
    const ranges = [{ start: "09:00", end: "13:00" }];
    expect(fitsWorkingRanges(ranges, 12 * 60 + 30, 45)).toBe(false); // 12:30–13:15 overruns
    expect(fitsWorkingRanges(ranges, 12 * 60 + 15, 45)).toBe(true); // 12:15–13:00 fits exactly
  });
});
