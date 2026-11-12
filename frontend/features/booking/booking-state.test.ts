import { describe, expect, it } from "vitest";
import { bookingReducer, initialBookingState, maxReachableStep, type BookingState } from "./booking-state";

const patient = { fullName: "Test", gender: "FEMALE" as const, ageYears: 30, phone: "+8801712345678", email: null, relationship: "SELF" as const, reasonForVisit: null, patientId: null };
const slot = { startsAt: "2026-11-14T04:00:00.000Z", endsAt: "2026-11-14T04:45:00.000Z", availableCount: 1 };

function filled(): BookingState {
  let s = initialBookingState("k");
  s = bookingReducer(s, { type: "selectService", serviceId: "svc_physiotherapy", eligibleGenders: [] });
  s = bookingReducer(s, { type: "selectGender", gender: "FEMALE" });
  s = bookingReducer(s, { type: "savePatient", patient });
  s = bookingReducer(s, { type: "selectDate", date: "2026-11-14" });
  return bookingReducer(s, { type: "selectSlot", slot });
}

describe("booking wizard state", () => {
  it("walks the steps in order", () => {
    expect(filled().step).toBe("review");
    expect(maxReachableStep(filled())).toBe("review");
  });

  it("preselects a service from the URL and starts at the gender step", () => {
    expect(initialBookingState("k", "svc_x").step).toBe("gender");
  });

  it("changing service clears date and slot (availability differs)", () => {
    const s = bookingReducer(filled(), { type: "selectService", serviceId: "svc_dental", eligibleGenders: [] });
    expect(s.date).toBeNull();
    expect(s.slot).toBeNull();
    expect(s.patient).not.toBeNull();
  });

  it("switching to a female-only service drops an ineligible male selection", () => {
    let s = initialBookingState("k");
    s = bookingReducer(s, { type: "selectService", serviceId: "a", eligibleGenders: [] });
    s = bookingReducer(s, { type: "selectGender", gender: "MALE" });
    s = bookingReducer(s, { type: "selectService", serviceId: "preg", eligibleGenders: ["FEMALE"] });
    expect(s.gender).toBeNull();
  });

  it("changing gender clears the time selection (different practitioners)", () => {
    const s = bookingReducer(filled(), { type: "selectGender", gender: "MALE" });
    expect(s.slot).toBeNull();
    expect(s.patient?.gender).toBe("MALE");
  });

  it("cannot jump ahead to steps that aren't filled in", () => {
    const s = bookingReducer(initialBookingState("k"), { type: "goTo", step: "review" });
    expect(s.step).toBe("service");
  });

  it("a taken slot sends the user back to time selection", () => {
    const s = bookingReducer(filled(), { type: "slotTaken" });
    expect(s.step).toBe("time");
    expect(s.slot).toBeNull();
  });

  it("is frozen after confirmation until reset", () => {
    const done = bookingReducer(filled(), { type: "confirmed", confirmation: {} as never });
    expect(bookingReducer(done, { type: "back" }).step).toBe("done");
    expect(bookingReducer(done, { type: "reset", idempotencyKey: "k2" }).step).toBe("service");
  });
});
