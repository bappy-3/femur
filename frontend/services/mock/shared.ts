import { toDhakaDate } from "@/lib/datetime";
import type { Appointment, AppointmentStatus, CreateAppointmentInput } from "@/types/appointment";
import type { ID } from "@/types/common";
import { ApiError } from "../http/client";
import { calculateCommission, describeRule, resolveRule } from "./commission";
import { db } from "./db";
import { candidatePractitioners, computeSlots, hasConflict, pickPractitioner } from "./scheduling";
import { listPriceFor, makeReference } from "./seed";

/** Simulated network latency in the browser so loading states are visible during development. */
export async function latency(ms = 220) {
  if (typeof window !== "undefined") await new Promise((r) => setTimeout(r, ms));
}

export const clone = <T,>(v: T): T => structuredClone(v);

export function notFound(what: string): never {
  throw new ApiError(404, "NOT_FOUND", `${what} was not found.`);
}

export function findService(id: ID) {
  return db().services.find((s) => s.id === id) ?? notFound("Service");
}

export function practitionerName(id: ID | null) {
  return id ? (db().practitioners.find((p) => p.id === id)?.displayName ?? "Unknown") : null;
}

interface BookOptions {
  practitionerId?: ID;
  source: Appointment["source"];
  overrideReason?: string | null;
  initialStatus?: AppointmentStatus;
}

/** Shared booking routine (public wizard + admin). Mirrors the backend transaction. */
export function bookAppointment(input: CreateAppointmentInput, opts: BookOptions): Appointment {
  const store = db();
  const service = findService(input.serviceId);
  const gender = input.patient.gender;
  const date = toDhakaDate(input.startsAt);
  const endsAt = new Date(new Date(input.startsAt).getTime() + service.rules.durationMinutes * 60_000).toISOString();

  let practitionerId: ID | null;
  if (opts.practitionerId) {
    const eligible = candidatePractitioners(service, gender, store.practitioners).some((p) => p.id === opts.practitionerId);
    if (!eligible && !opts.overrideReason) {
      throw new ApiError(422, "VALIDATION_FAILED", "This practitioner does not match the service's gender policy. Provide an override reason to continue.");
    }
    if (hasConflict(opts.practitionerId, input.startsAt, endsAt, store.appointments, store.blocks)) {
      throw new ApiError(409, "SLOT_TAKEN", "That time overlaps another appointment or blocked time for this practitioner.");
    }
    practitionerId = opts.practitionerId;
  } else {
    const slot = computeSlots({ service, gender, date, practitioners: store.practitioners, appointments: store.appointments, blocks: store.blocks, now: new Date() }).find(
      (s) => s.startsAt === input.startsAt,
    );
    if (!slot) throw new ApiError(409, "SLOT_TAKEN", "Sorry — that time was just taken. Please choose another slot.");
    const preferred = input.preferredPractitionerId && slot.practitionerIds.includes(input.preferredPractitionerId) ? input.preferredPractitionerId : null;
    practitionerId = preferred ?? pickPractitioner(slot.practitionerIds, date, store.appointments);
  }
  if (!practitionerId) throw new ApiError(409, "SLOT_UNAVAILABLE", "No practitioner is available at that time.");

  const existing = input.patient.patientId ? store.patients.find((p) => p.id === input.patient.patientId) : undefined;
  const patient =
    existing ??
    (() => {
      const record = {
        id: `pat_${store.patients.length + 1}_${Math.floor(store.rand() * 1e6)}`,
        fullName: input.patient.fullName,
        gender,
        ageYears: input.patient.ageYears,
        phone: input.patient.phone,
        email: input.patient.email,
        medicalRecordNo: `MRN-${2000 + store.patients.length}`,
        registeredAt: new Date().toISOString(),
        isWalkIn: opts.source === "WALK_IN",
        membershipStatus: "NONE",
        lastVisit: null,
        totalVisits: 0,
        internalNotes: [],
      };
      store.patients.push(record);
      return record;
    })();

  const list = listPriceFor(service);
  const appointment: Appointment = {
    id: `apt_${store.appointments.length + 1}_${Math.floor(store.rand() * 1e6)}`,
    reference: makeReference(store.rand),
    status: opts.initialStatus ?? (service.rules.bookingMode === "AUTO_CONFIRM" ? "CONFIRMED" : "PENDING"),
    source: opts.source,
    serviceId: service.id,
    serviceName: service.name,
    patient: { id: patient.id, fullName: patient.fullName, gender: patient.gender, ageYears: patient.ageYears, phone: patient.phone, email: patient.email, medicalRecordNo: patient.medicalRecordNo },
    assignedPractitionerId: practitionerId,
    treatingPractitionerId: null,
    startsAt: input.startsAt,
    endsAt,
    reasonForVisit: input.reasonForVisit,
    charge: { listPrice: list, discount: null, net: list, paymentStatus: "UNPAID" },
    createdAt: new Date().toISOString(),
  };
  store.appointments.push(appointment);
  return appointment;
}

/** On completion: set treating practitioner and snapshot the commission (never recalculated later). */
export function snapshotCommission(appt: Appointment) {
  const store = db();
  const treating = appt.treatingPractitionerId ?? appt.assignedPractitionerId;
  appt.treatingPractitionerId = treating;
  const { listPrice, net } = appt.charge;
  if (!listPrice || !net || store.commissions.some((c) => c.appointmentReference === appt.reference)) return;
  const rule = resolveRule(store.commissionRules, treating, appt.serviceId, toDhakaDate(appt.startsAt));
  if (!rule) return;
  store.commissions.unshift({
    id: `com_${store.commissions.length + 1}_${Math.floor(store.rand() * 1e6)}`,
    appointmentReference: appt.reference,
    completedAt: new Date().toISOString(),
    practitionerId: treating,
    practitionerName: practitionerName(treating) ?? "Unknown",
    serviceName: appt.serviceName,
    baseAmount: rule.base === "GROSS" ? listPrice : net,
    ruleLabel: describeRule(rule),
    computedAmount: calculateCommission(rule, listPrice, net),
    overrideAmount: null,
    overrideReason: null,
    status: appt.charge.paymentStatus === "PAID" ? "PAYABLE" : "PENDING_PAYMENT",
  });
}
