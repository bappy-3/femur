import type { Gender, ID, ISODate, ISODateTime } from "./common";

export interface TimeRange {
  start: string; // "HH:mm"
  end: string; // "HH:mm"
}

export type AvailabilityRule =
  | (RuleBase & { kind: "WEEKLY"; weekdays: number[] })
  | (RuleBase & { kind: "EVERY_N_WEEKS"; weekday: number; intervalWeeks: number; anchorDate: ISODate })
  | (RuleBase & { kind: "MONTHLY_NTH_WEEKDAY"; weekday: number; nth: number[] })
  | (RuleBase & { kind: "SPECIFIC_DATE"; date: ISODate });

interface RuleBase {
  id: ID;
  start: string;
  end: string;
  breaks: TimeRange[];
  effectiveFrom: ISODate;
  effectiveTo: ISODate | null;
}

export interface AvailabilityException {
  id: ID;
  practitionerId: ID;
  date: ISODate;
  kind: "UNAVAILABLE" | "EXTRA";
  range: TimeRange | null; // null = whole day
  reason: string;
}

export interface TimeBlock {
  id: ID;
  practitionerId: ID | null; // null = clinic-wide
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  reason: string;
}

export type CommissionType = "PERCENTAGE" | "FIXED";

export interface CommissionRule {
  id: ID;
  practitionerId: ID | null;
  serviceId: ID | null;
  type: CommissionType;
  /** Percentage in basis points when type = PERCENTAGE (2500 = 25%) */
  rateBps: number | null;
  /** Poisha when type = FIXED */
  fixedAmount: number | null;
  base: "NET_AFTER_DISCOUNT" | "GROSS";
  effectiveFrom: ISODate;
  effectiveTo: ISODate | null;
}

export interface Practitioner {
  id: ID;
  slug: string;
  displayName: string;
  /** True while real details have not been provided by Femur. */
  isPlaceholder: boolean;
  gender: Gender;
  designation: string;
  qualifications: string[];
  specialization: string;
  experienceYears: number | null;
  bio: string;
  photo: { src: string; alt: string } | null;
  serviceIds: ID[];
  availabilitySummary: string;
  isVisiting: boolean;
  isActive: boolean;
  isPublic: boolean;
  sessionMinutes: number;
  rules: AvailabilityRule[];
  /** Calendar column accent */
  color: string;
}
