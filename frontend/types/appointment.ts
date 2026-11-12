import type { DeliveryStatus, Gender, ID, ISODate, ISODateTime, Money } from "./common";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "NO_SHOW";

export const ACTIVE_STATUSES: AppointmentStatus[] = ["PENDING", "CONFIRMED", "IN_PROGRESS"];

export type AppointmentSource = "WEB" | "ADMIN" | "WALK_IN" | "PHONE";
export type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID" | "REFUNDED" | "WAIVED";
export type Relationship = "SELF" | "CHILD" | "PARENT" | "SPOUSE" | "SIBLING" | "OTHER";

export interface PatientSummary {
  id: ID;
  fullName: string;
  gender: Gender;
  ageYears: number | null;
  phone: string;
  email: string | null;
  medicalRecordNo: string;
}

export interface AppointmentCharge {
  listPrice: Money | null;
  discount: Money | null;
  net: Money | null;
  paymentStatus: PaymentStatus;
}

export interface Appointment {
  id: ID;
  reference: string;
  status: AppointmentStatus;
  source: AppointmentSource;
  serviceId: ID;
  serviceName: string;
  patient: PatientSummary;
  assignedPractitionerId: ID;
  treatingPractitionerId: ID | null;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  reasonForVisit: string | null;
  charge: AppointmentCharge;
  createdAt: ISODateTime;
}

export interface AppointmentStatusChange {
  from: AppointmentStatus | null;
  to: AppointmentStatus;
  at: ISODateTime;
  by: string;
  reason: string | null;
}

export interface AvailableDate {
  date: ISODate;
  hasSlots: boolean;
}

export interface AvailabilitySlot {
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  availableCount: number;
}

export interface BookingPatientInput {
  patientId: ID | null;
  fullName: string;
  gender: Gender;
  dateOfBirth: ISODate | null;
  ageYears: number | null;
  phone: string;
  email: string | null;
  relationship: Relationship;
}

export interface CreateAppointmentInput {
  serviceId: ID;
  startsAt: ISODateTime;
  patient: BookingPatientInput;
  reasonForVisit: string | null;
  preferredPractitionerId: ID | null;
}

export interface AppointmentConfirmation {
  id: ID;
  reference: string;
  status: AppointmentStatus;
  serviceName: string;
  practitionerName: string | null;
  startsAt: ISODateTime;
  endsAt: ISODateTime;
  patientName: string;
  charge: AppointmentCharge;
  notifications: { channel: "SMS" | "EMAIL" | "WHATSAPP"; status: DeliveryStatus }[];
}
