import type { Gender, ID, ImageAsset, Money } from "./common";

export type ServiceKind = "PHYSIOTHERAPY" | "CONSULTANCY";
export type GenderPolicy = "REQUIRED_SAME_GENDER" | "PREFERRED" | "NONE";
export type BookingMode = "AUTO_CONFIRM" | "REQUIRES_APPROVAL";

/** Icon keys map to lucide icons in features/service-catalog/service-icon.tsx */
export type ServiceIconKey =
  | "activity"
  | "pain"
  | "pregnancy"
  | "sports"
  | "bone"
  | "brain"
  | "surgery"
  | "posture"
  | "exercise"
  | "nutrition"
  | "medicine"
  | "eye"
  | "dental";

export interface BookingRules {
  durationMinutes: number;
  bufferMinutes: number;
  genderPolicy: GenderPolicy;
  bookingMode: BookingMode;
  allowPractitionerChoice: boolean;
  minLeadMinutes: number;
  maxDaysAhead: number;
  cancellationCutoffMinutes: number;
  /** Restrict which patient genders may book (e.g. pregnancy care). Empty = all. */
  eligibleGenders: Gender[];
}

export interface Service {
  id: ID;
  slug: string;
  name: string;
  kind: ServiceKind;
  icon: ServiceIconKey;
  summary: string;
  description: string;
  benefitsFor: string[];
  approach: string[];
  whatToExpect: string[];
  image: ImageAsset;
  /** Human summary of when the service runs, e.g. "Visiting specialist · alternate Fridays" */
  availabilityNote: string | null;
  startingPrice: Money | null;
  relatedSlugs: string[];
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  rules: BookingRules;
}
