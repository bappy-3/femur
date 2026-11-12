import type { ID, ISODate, ISODateTime, Money } from "./common";

export type PriceItemKind = "SESSION" | "PACKAGE" | "CONSULTATION" | "OFFER";

export interface PriceItem {
  id: ID;
  kind: PriceItemKind;
  serviceId: ID | null;
  name: string;
  description: string;
  sessionsIncluded: number | null;
  amount: Money;
  compareAtAmount: Money | null;
  validFrom: ISODate | null;
  validTo: ISODate | null;
  isPublished: boolean;
  sortOrder: number;
}

export type BillingPeriod = "MONTHLY" | "QUARTERLY" | "ANNUAL";

export interface MembershipPlan {
  id: ID;
  slug: string;
  name: string;
  tagline: string;
  billingPeriod: BillingPeriod;
  durationDays: number;
  price: Money;
  benefits: string[];
  entitlements: Record<string, string | number | boolean>;
  includesNira: boolean;
  isHighlighted: boolean;
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
}

export type MembershipStatus = "NONE" | "PENDING_PAYMENT" | "ACTIVE" | "EXPIRED" | "SUSPENDED" | "CANCELLED";

export interface MembershipState {
  status: MembershipStatus;
  planId: ID | null;
  planName: string | null;
  startsAt: ISODateTime | null;
  endsAt: ISODateTime | null;
  entitlements: Record<string, string | number | boolean>;
}

export interface MemberRecord {
  id: ID;
  userName: string;
  phone: string;
  planName: string;
  status: MembershipStatus;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
}
