/**
 * Commission rule resolution + calculation (MOCK MODE mirror of the backend engine).
 * See docs/architecture/MEMBERSHIP_AND_COMMISSIONS.md.
 */
import type { Money, ID, ISODate } from "@/types/common";
import type { CommissionRule } from "@/types/practitioner";

export function resolveRule(rules: CommissionRule[], practitionerId: ID, serviceId: ID, date: ISODate): CommissionRule | null {
  const active = rules.filter((r) => r.effectiveFrom <= date && (r.effectiveTo === null || date < r.effectiveTo));
  return (
    active.find((r) => r.practitionerId === practitionerId && r.serviceId === serviceId) ??
    active.find((r) => r.practitionerId === practitionerId && r.serviceId === null) ??
    active.find((r) => r.practitionerId === null && r.serviceId === serviceId) ??
    active.find((r) => r.practitionerId === null && r.serviceId === null) ??
    null
  );
}

export function calculateCommission(rule: CommissionRule, gross: Money, net: Money): Money {
  const base = rule.base === "GROSS" ? gross : net;
  const amount = rule.type === "PERCENTAGE" ? Math.round((base.amount * (rule.rateBps ?? 0)) / 10_000) : (rule.fixedAmount ?? 0);
  return { amount, currency: "BDT" };
}

export function describeRule(rule: CommissionRule): string {
  const scope = rule.practitionerId && rule.serviceId ? "Practitioner + service" : rule.practitionerId ? "Practitioner" : rule.serviceId ? "Service" : "Clinic default";
  const value = rule.type === "PERCENTAGE" ? `${(rule.rateBps ?? 0) / 100}%` : `৳${(rule.fixedAmount ?? 0) / 100} fixed`;
  return `${value} · ${scope}`;
}
