import type { Appointment } from "./appointment";
import type { ID, ISODate, ISODateTime, Money } from "./common";
import type { Practitioner, TimeBlock, TimeRange } from "./practitioner";

export interface CalendarQuery {
  date: ISODate;
  days: number; // 1 = day view, 7 = week view
  practitionerIds?: ID[];
  serviceId?: ID | null;
}

export interface PractitionerDayAvailability {
  practitionerId: ID;
  date: ISODate;
  ranges: TimeRange[];
}

export interface CalendarData {
  practitioners: Practitioner[];
  appointments: Appointment[];
  blocks: TimeBlock[];
  availability: PractitionerDayAvailability[];
  clinicHours: TimeRange;
}

export interface DashboardSummary {
  date: ISODate;
  todayCount: number;
  upcomingCount: number;
  completedCount: number;
  pendingCount: number;
  cancelledCount: number;
  revenue: Money;
  outstanding: Money;
  activeMemberships: number;
  revenueByDay: { date: ISODate; amount: number }[];
  appointmentsByService: { serviceName: string; count: number }[];
  practitionerLoad: { practitionerId: ID; name: string; completed: number; scheduled: number }[];
}

export type CommissionStatus = "PENDING_PAYMENT" | "PAYABLE" | "SETTLED" | "VOID";

export interface CommissionRecord {
  id: ID;
  appointmentReference: string;
  completedAt: ISODateTime;
  practitionerId: ID;
  practitionerName: string;
  serviceName: string;
  baseAmount: Money;
  ruleLabel: string;
  computedAmount: Money;
  overrideAmount: Money | null;
  overrideReason: string | null;
  status: CommissionStatus;
}

export type PaymentMethod = "CASH" | "MANUAL" | "BKASH" | "NAGAD" | "GATEWAY";

export interface PaymentRecord {
  id: ID;
  createdAt: ISODateTime;
  payerName: string;
  purpose: "APPOINTMENT" | "MEMBERSHIP" | "PACKAGE";
  reference: string;
  method: PaymentMethod;
  amount: Money;
  status: "INITIATED" | "PENDING_VERIFICATION" | "SUCCEEDED" | "FAILED" | "REFUNDED";
}

export interface PatientRecord {
  id: ID;
  fullName: string;
  gender: "MALE" | "FEMALE";
  ageYears: number | null;
  phone: string;
  email: string | null;
  medicalRecordNo: string;
  registeredAt: ISODateTime;
  isWalkIn: boolean;
  membershipStatus: string;
  lastVisit: ISODateTime | null;
  totalVisits: number;
  internalNotes: { id: ID; at: ISODateTime; author: string; body: string }[];
}

export interface ProviderStatus {
  key: string;
  label: string;
  configured: boolean;
}
