import { describe, expect, it } from "vitest";
import { dhakaDateTimeToUtc } from "@/lib/datetime";
import type { Appointment } from "@/types/appointment";
import { serviceFixtures } from "./fixtures/catalog";
import { practitionerFixtures } from "./fixtures/practitioners";
import { candidatePractitioners, computeSlots, hasConflict, pickPractitioner, ruleAppliesOn, subtractIntervals, workingIntervals } from "./scheduling";

const svc = (slug: string) => serviceFixtures.find((s) => s.slug === slug)!;
const prac = (id: string) => practitionerFixtures.find((p) => p.id === id)!;
// "now" well before the test dates so lead time never interferes unless intended
const NOW = new Date("2026-11-10T00:00:00.000Z");

function appt(p: string, date: string, startMin: number, dur: number, status: Appointment["status"] = "CONFIRMED"): Appointment {
  return {
    id: `a_${p}_${startMin}`, reference: "FMR-TEST", status, source: "WEB", serviceId: "svc_physiotherapy", serviceName: "Physiotherapy",
    patient: { id: "x", fullName: "X", gender: "MALE", ageYears: 30, phone: "+8801700000000", email: null, medicalRecordNo: "MRN" },
    assignedPractitionerId: p, treatingPractitionerId: null,
    startsAt: dhakaDateTimeToUtc(date, startMin).toISOString(), endsAt: dhakaDateTimeToUtc(date, startMin + dur).toISOString(),
    reasonForVisit: null, charge: { listPrice: null, discount: null, net: null, paymentStatus: "UNPAID" }, createdAt: NOW.toISOString(),
  };
}

describe("interval maths", () => {
  it("subtracts breaks and busy time", () => {
    expect(subtractIntervals([{ start: 540, end: 1200 }], [{ start: 780, end: 900 }])).toEqual([
      { start: 540, end: 780 },
      { start: 900, end: 1200 },
    ]);
  });
});

describe("availability rules", () => {
  it("weekly physiotherapist works Sat–Thu with a lunch break, not Friday", () => {
    const m1 = prac("prc_physio_m1");
    expect(workingIntervals(m1, "2026-11-12")).toEqual([
      { start: 540, end: 780 },
      { start: 900, end: 1200 },
    ]);
    expect(workingIntervals(m1, "2026-11-13")).toEqual([]); // Friday
  });

  it("eye specialist visits only on alternate Fridays from the anchor date", () => {
    const rule = prac("prc_eye").rules[0]!;
    expect(ruleAppliesOn(rule, "2026-11-06")).toBe(true);
    expect(ruleAppliesOn(rule, "2026-11-13")).toBe(false);
    expect(ruleAppliesOn(rule, "2026-11-20")).toBe(true);
    expect(ruleAppliesOn(rule, "2026-10-30")).toBe(false); // before anchor
  });

  it("visiting physician works on the 1st and 3rd Tuesday only", () => {
    const rule = prac("prc_gp").rules[0]!;
    expect(ruleAppliesOn(rule, "2026-11-03")).toBe(true);
    expect(ruleAppliesOn(rule, "2026-11-10")).toBe(false);
    expect(ruleAppliesOn(rule, "2026-11-17")).toBe(true);
  });

  it("respects effective dates", () => {
    const rule = { ...prac("prc_physio_m1").rules[0]!, effectiveTo: "2026-11-12" };
    expect(ruleAppliesOn(rule, "2026-11-11")).toBe(true);
    expect(ruleAppliesOn(rule, "2026-11-12")).toBe(false);
  });
});

describe("gender policy", () => {
  it("physiotherapy: male patients only see male practitioners", () => {
    const ids = candidatePractitioners(svc("physiotherapy"), "MALE", practitionerFixtures).map((p) => p.id);
    expect(ids).toEqual(["prc_physio_m1", "prc_physio_m2"]);
  });

  it("pregnancy rehabilitation is unavailable to male patients and female-only for practitioners", () => {
    expect(candidatePractitioners(svc("pregnancy-rehabilitation"), "MALE", practitionerFixtures)).toEqual([]);
    expect(candidatePractitioners(svc("pregnancy-rehabilitation"), "FEMALE", practitionerFixtures).every((p) => p.gender === "FEMALE")).toBe(true);
  });

  it("consultancy with policy NONE is open to any patient gender", () => {
    expect(candidatePractitioners(svc("dental-consultancy"), "FEMALE", practitionerFixtures).map((p) => p.id)).toEqual(["prc_dental"]);
  });
});

describe("slot generation", () => {
  const base = { practitioners: practitionerFixtures, blocks: [], now: NOW };

  it("produces 45-minute slots and aggregates practitioners per start time", () => {
    const slots = computeSlots({ ...base, service: svc("physiotherapy"), gender: "MALE", date: "2026-11-12", appointments: [] });
    expect(slots[0]!.startsAt).toBe(dhakaDateTimeToUtc("2026-11-12", 540).toISOString());
    // At 15:00 both male physios are working
    const at15 = slots.find((s) => s.startsAt === dhakaDateTimeToUtc("2026-11-12", 900).toISOString());
    expect(at15?.availableCount).toBe(2);
  });

  it("removes a slot once booked and never returns overlapping times for that practitioner", () => {
    const booked = [appt("prc_physio_m1", "2026-11-12", 540, 45)];
    const slots = computeSlots({ ...base, service: svc("physiotherapy"), gender: "MALE", date: "2026-11-12", appointments: booked });
    expect(slots.some((s) => s.startsAt === booked[0]!.startsAt)).toBe(false);
  });

  it("cancelled appointments free the slot again", () => {
    const cancelled = [appt("prc_physio_m1", "2026-11-12", 540, 45, "CANCELLED")];
    const slots = computeSlots({ ...base, service: svc("physiotherapy"), gender: "MALE", date: "2026-11-12", appointments: cancelled });
    expect(slots.some((s) => s.startsAt === cancelled[0]!.startsAt)).toBe(true);
  });

  it("enforces minimum lead time", () => {
    const now = dhakaDateTimeToUtc("2026-11-12", 600); // 10:00
    const slots = computeSlots({ ...base, now, service: svc("physiotherapy"), gender: "MALE", date: "2026-11-12", appointments: [] });
    expect(new Date(slots[0]!.startsAt).getTime()).toBeGreaterThanOrEqual(now.getTime() + 120 * 60_000);
  });

  it("returns nothing outside the booking window or on non-visiting days", () => {
    expect(computeSlots({ ...base, service: svc("physiotherapy"), gender: "MALE", date: "2027-02-01", appointments: [] })).toEqual([]);
    expect(computeSlots({ ...base, service: svc("eye-care-consultancy"), gender: "MALE", date: "2026-11-13", appointments: [] })).toEqual([]);
    expect(computeSlots({ ...base, service: svc("eye-care-consultancy"), gender: "MALE", date: "2026-11-20", appointments: [] }).length).toBeGreaterThan(0);
  });
});

describe("assignment & conflicts", () => {
  it("auto-assigns the least-loaded practitioner deterministically", () => {
    const busy = [appt("prc_physio_m1", "2026-11-12", 540, 45)];
    expect(pickPractitioner(["prc_physio_m1", "prc_physio_m2"], "2026-11-12", busy)).toBe("prc_physio_m2");
    expect(pickPractitioner(["prc_physio_m1", "prc_physio_m2"], "2026-11-12", [])).toBe("prc_physio_m1");
  });

  it("detects overlaps with appointments and clinic-wide blocks", () => {
    const a = appt("prc_physio_m1", "2026-11-12", 540, 45);
    const s = dhakaDateTimeToUtc("2026-11-12", 570).toISOString();
    const e = dhakaDateTimeToUtc("2026-11-12", 615).toISOString();
    expect(hasConflict("prc_physio_m1", s, e, [a], [])).toBe(true);
    expect(hasConflict("prc_physio_m1", s, e, [a], [], a.id)).toBe(false);
    expect(hasConflict("prc_physio_m2", s, e, [], [{ id: "b", practitionerId: null, startsAt: s, endsAt: e, reason: "Training" }])).toBe(true);
  });
});
