import { describe, expect, it } from "vitest";
import {
  addDays,
  daysBetween,
  dhakaDateTimeToUtc,
  dhakaMinutesOfDay,
  formatDate,
  formatDayLong,
  formatDayShort,
  formatTime,
  nthWeekdayOfMonth,
  startOfWeek,
  toDhakaDate,
  weekdayOf,
} from "./datetime";

describe("Asia/Dhaka date helpers", () => {
  it("converts Dhaka wall-clock time to UTC (UTC+6)", () => {
    expect(dhakaDateTimeToUtc("2026-11-12", 9 * 60).toISOString()).toBe("2026-11-12T03:00:00.000Z");
  });

  it("maps late-UTC instants to the next Dhaka day", () => {
    expect(toDhakaDate("2026-11-12T19:30:00.000Z")).toBe("2026-11-13");
    expect(dhakaMinutesOfDay("2026-11-12T19:30:00.000Z")).toBe(90);
  });

  it("does calendar arithmetic across month boundaries", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(daysBetween("2026-11-06", "2026-11-20")).toBe(14);
  });

  it("starts weeks on Saturday (Bangladesh)", () => {
    expect(weekdayOf("2026-11-12")).toBe(4); // Thursday
    expect(startOfWeek("2026-11-12")).toBe("2026-11-07");
    expect(startOfWeek("2026-11-07")).toBe("2026-11-07");
  });

  it("computes the nth weekday of the month", () => {
    expect(nthWeekdayOfMonth("2026-11-03")).toBe(1);
    expect(nthWeekdayOfMonth("2026-11-17")).toBe(3);
  });

  it("formats deterministically (identical on server and browser)", () => {
    expect(formatDayLong("2026-11-12")).toBe("Thursday, 12 November 2026");
    expect(formatDayShort("2026-11-12")).toBe("Thu, 12 Nov");
    expect(formatDate("2026-11-12T19:30:00.000Z")).toBe("13 Nov 2026");
    expect(formatTime("2026-11-12T03:00:00.000Z")).toBe("9:00 am");
    expect(formatTime("2026-11-12T06:30:00.000Z")).toBe("12:30 pm");
  });
});
