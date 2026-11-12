import { describe, expect, it } from "vitest";
import { bdt } from "@/lib/money";
import type { CommissionRule } from "@/types/practitioner";
import { calculateCommission, resolveRule } from "./commission";

const rule = (over: Partial<CommissionRule>): CommissionRule => ({
  id: "r", practitionerId: null, serviceId: null, type: "PERCENTAGE", rateBps: 3000, fixedAmount: null, base: "NET_AFTER_DISCOUNT", effectiveFrom: "2026-01-01", effectiveTo: null, ...over,
});

const rules: CommissionRule[] = [
  rule({ id: "default" }),
  rule({ id: "service", serviceId: "svc_neuro", rateBps: 3500 }),
  rule({ id: "pract", practitionerId: "p1", rateBps: 4000 }),
  rule({ id: "pract+service", practitionerId: "p1", serviceId: "svc_neuro", type: "FIXED", rateBps: null, fixedAmount: 70000 }),
  rule({ id: "old", practitionerId: "p2", rateBps: 3000, effectiveTo: "2026-11-01" }),
  rule({ id: "new", practitionerId: "p2", rateBps: 3500, effectiveFrom: "2026-11-01" }),
];

describe("commission rule precedence", () => {
  it("picks the most specific rule", () => {
    expect(resolveRule(rules, "p1", "svc_neuro", "2026-11-12")?.id).toBe("pract+service");
    expect(resolveRule(rules, "p1", "svc_physio", "2026-11-12")?.id).toBe("pract");
    expect(resolveRule(rules, "p9", "svc_neuro", "2026-11-12")?.id).toBe("service");
    expect(resolveRule(rules, "p9", "svc_physio", "2026-11-12")?.id).toBe("default");
  });

  it("uses the rule effective on the session date (history is never re-rated)", () => {
    expect(resolveRule(rules, "p2", "svc_physio", "2026-10-31")?.id).toBe("old");
    expect(resolveRule(rules, "p2", "svc_physio", "2026-11-01")?.id).toBe("new");
  });
});

describe("commission calculation", () => {
  it("percentage of net (after discount) by default", () => {
    expect(calculateCommission(rule({ rateBps: 3000 }), bdt(1500), bdt(1350)).amount).toBe(40500);
  });
  it("percentage of gross when configured", () => {
    expect(calculateCommission(rule({ rateBps: 3000, base: "GROSS" }), bdt(1500), bdt(1350)).amount).toBe(45000);
  });
  it("fixed amount per completed session", () => {
    expect(calculateCommission(rule({ type: "FIXED", rateBps: null, fixedAmount: 60000 }), bdt(1000), bdt(900)).amount).toBe(60000);
  });
});
