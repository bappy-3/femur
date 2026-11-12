import { bdt } from "@/lib/money";
import type { MembershipPlan, PriceItem } from "@/types/membership";

/** SAMPLE prices for UI development only. These are NOT Femur's rates. */
export const priceItemFixtures: PriceItem[] = [
  { id: "pi_1", kind: "SESSION", serviceId: "svc_physiotherapy", name: "Physiotherapy session", description: "Single 45-minute assessment or treatment session", sessionsIncluded: 1, amount: bdt(1500), compareAtAmount: null, validFrom: null, validTo: null, isPublished: true, sortOrder: 1 },
  { id: "pi_2", kind: "SESSION", serviceId: "svc_neurological_rehabilitation", name: "Neurological rehabilitation session", description: "Single 60-minute session", sessionsIncluded: 1, amount: bdt(1800), compareAtAmount: null, validFrom: null, validTo: null, isPublished: true, sortOrder: 2 },
  { id: "pi_3", kind: "SESSION", serviceId: "svc_pregnancy_rehabilitation", name: "Pregnancy rehabilitation session", description: "Single session with a female physiotherapist", sessionsIncluded: 1, amount: bdt(1800), compareAtAmount: null, validFrom: null, validTo: null, isPublished: true, sortOrder: 3 },
  { id: "pi_4", kind: "PACKAGE", serviceId: "svc_physiotherapy", name: "6-session recovery package", description: "Six physiotherapy sessions, valid for 60 days", sessionsIncluded: 6, amount: bdt(8100), compareAtAmount: bdt(9000), validFrom: null, validTo: null, isPublished: true, sortOrder: 4 },
  { id: "pi_5", kind: "PACKAGE", serviceId: "svc_physiotherapy", name: "12-session programme", description: "Twelve sessions, valid for 120 days", sessionsIncluded: 12, amount: bdt(15300), compareAtAmount: bdt(18000), validFrom: null, validTo: null, isPublished: true, sortOrder: 5 },
  { id: "pi_6", kind: "CONSULTATION", serviceId: "svc_nutritionist_consultancy", name: "Nutritionist consultation", description: "On visiting days", sessionsIncluded: 1, amount: bdt(1000), compareAtAmount: null, validFrom: null, validTo: null, isPublished: true, sortOrder: 6 },
  { id: "pi_7", kind: "CONSULTATION", serviceId: "svc_general_medicine_consultancy", name: "General medicine consultation", description: "On visiting days", sessionsIncluded: 1, amount: bdt(1000), compareAtAmount: null, validFrom: null, validTo: null, isPublished: true, sortOrder: 7 },
  { id: "pi_8", kind: "CONSULTATION", serviceId: "svc_eye_care_consultancy", name: "Eye care consultation", description: "Alternate Fridays", sessionsIncluded: 1, amount: bdt(1000), compareAtAmount: null, validFrom: null, validTo: null, isPublished: true, sortOrder: 8 },
  { id: "pi_9", kind: "CONSULTATION", serviceId: "svc_dental_consultancy", name: "Dental consultation", description: "Fridays", sessionsIncluded: 1, amount: bdt(800), compareAtAmount: null, validFrom: null, validTo: null, isPublished: true, sortOrder: 9 },
  { id: "pi_10", kind: "OFFER", serviceId: "svc_posture_correction", name: "Desk-worker posture check", description: "Introductory assessment with take-home routine", sessionsIncluded: 1, amount: bdt(1000), compareAtAmount: bdt(1500), validFrom: null, validTo: "2026-12-31", isPublished: true, sortOrder: 10 },
];

export const membershipPlanFixtures: MembershipPlan[] = [
  {
    id: "plan_monthly", slug: "monthly-care", name: "Monthly Care", tagline: "Stay on track between sessions",
    billingPeriod: "MONTHLY", durationDays: 30, price: bdt(1500),
    benefits: ["Full access to Nira, Femur's members-only consultant", "Member discount on physiotherapy sessions", "Priority booking window", "Exercise reminders and progress tips"],
    entitlements: { "nira.access": true, "nira.daily_messages": 50, "discount.percent.physiotherapy": 10, "priority_booking.days_ahead": 45 },
    includesNira: true, isHighlighted: true, isActive: true, isPublic: true, sortOrder: 1,
  },
  {
    id: "plan_quarterly", slug: "quarterly-care", name: "Quarterly Care", tagline: "For a full rehabilitation programme",
    billingPeriod: "QUARTERLY", durationDays: 90, price: bdt(4000),
    benefits: ["Everything in Monthly Care", "Higher member discount on sessions", "One complimentary progress review"],
    entitlements: { "nira.access": true, "nira.daily_messages": 80, "discount.percent.physiotherapy": 12, "priority_booking.days_ahead": 60 },
    includesNira: true, isHighlighted: false, isActive: true, isPublic: true, sortOrder: 2,
  },
  {
    id: "plan_annual", slug: "annual-wellness", name: "Annual Wellness", tagline: "Year-round support for long-term health",
    billingPeriod: "ANNUAL", durationDays: 365, price: bdt(15000),
    benefits: ["Everything in Quarterly Care", "Best member discount", "Two complimentary consultancy visits"],
    entitlements: { "nira.access": true, "nira.daily_messages": 100, "discount.percent.physiotherapy": 15, "priority_booking.days_ahead": 60 },
    includesNira: true, isHighlighted: false, isActive: true, isPublic: true, sortOrder: 3,
  },
];
