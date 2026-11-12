import { describe, expect, it } from "vitest";
import { normalizeBdPhone, patientDetailsSchema } from "./schemas";

describe("Bangladeshi phone validation", () => {
  it("normalises common formats to E.164", () => {
    expect(normalizeBdPhone("01712345678")).toBe("+8801712345678");
    expect(normalizeBdPhone("+880 1712-345678")).toBe("+8801712345678");
    expect(normalizeBdPhone("8801912345678")).toBe("+8801912345678");
  });

  it("rejects invalid numbers", () => {
    expect(normalizeBdPhone("01212345678")).toBeNull(); // invalid operator prefix
    expect(normalizeBdPhone("0171234567")).toBeNull(); // too short
  });
});

describe("patient details", () => {
  it("accepts a minimal valid patient and converts empty optionals to null", () => {
    const r = patientDetailsSchema.parse({ fullName: "Nusrat J.", gender: "FEMALE", ageYears: "34", phone: "01712345678", email: "", relationship: "SELF", reasonForVisit: "" });
    expect(r).toMatchObject({ ageYears: 34, phone: "+8801712345678", email: null, reasonForVisit: null });
  });

  it("explains what is wrong in plain language", () => {
    const r = patientDetailsSchema.safeParse({ fullName: "", gender: "FEMALE", ageYears: "abc", phone: "123", email: "x", relationship: "SELF", reasonForVisit: "" });
    expect(r.success).toBe(false);
    const fields = r.success ? [] : r.error.issues.map((i) => i.path[0]);
    expect(fields).toEqual(expect.arrayContaining(["fullName", "ageYears", "phone", "email"]));
  });
});
