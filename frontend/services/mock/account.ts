import { toDhakaDate } from "@/lib/datetime";
import { isReschedulable } from "@/lib/appointment-status";
import type { AccountApi } from "../contracts";
import { ApiError } from "../http/client";
import { db } from "./db";
import { demoPatientUser } from "./fixtures/people";
import { computeSlots, pickPractitioner } from "./scheduling";
import { clone, findService, latency, notFound } from "./shared";
import { sessionUserFrom } from "./auth";

function ownAppointment(id: string) {
  const store = db();
  const ids = new Set(store.account.savedPatients.map((p) => p.id));
  const appt = store.appointments.find((a) => a.id === id && ids.has(a.patient.id));
  return appt ?? notFound("Appointment");
}

export const mockAccount: AccountApi = {
  listAppointments: async () => {
    await latency();
    const store = db();
    const ids = new Set(store.account.savedPatients.map((p) => p.id));
    return clone(store.appointments.filter((a) => ids.has(a.patient.id)).sort((a, b) => b.startsAt.localeCompare(a.startsAt)));
  },
  cancelAppointment: async (id, reason) => {
    await latency();
    const appt = ownAppointment(id);
    const service = findService(appt.serviceId);
    if (!isReschedulable(appt.status)) throw new ApiError(409, "INVALID_STATUS_TRANSITION", "This appointment can no longer be cancelled.");
    const minutesLeft = (new Date(appt.startsAt).getTime() - Date.now()) / 60_000;
    if (minutesLeft < service.rules.cancellationCutoffMinutes) {
      throw new ApiError(409, "CANCELLATION_WINDOW_PASSED", `Online cancellation closes ${service.rules.cancellationCutoffMinutes / 60} hours before the appointment. Please call the clinic.`);
    }
    appt.status = "CANCELLED";
    appt.reasonForVisit = appt.reasonForVisit ?? reason;
    return clone(appt);
  },
  rescheduleAppointment: async (id, startsAt) => {
    await latency(400);
    const store = db();
    const appt = ownAppointment(id);
    const service = findService(appt.serviceId);
    if (!isReschedulable(appt.status)) throw new ApiError(409, "INVALID_STATUS_TRANSITION", "This appointment can no longer be rescheduled.");
    const others = store.appointments.filter((a) => a.id !== appt.id);
    const date = toDhakaDate(startsAt);
    const slot = computeSlots({ service, gender: appt.patient.gender, date, practitioners: store.practitioners, appointments: others, blocks: store.blocks, now: new Date() }).find(
      (s) => s.startsAt === startsAt,
    );
    if (!slot) throw new ApiError(409, "SLOT_TAKEN", "That time is no longer available.");
    appt.assignedPractitionerId = slot.practitionerIds.includes(appt.assignedPractitionerId) ? appt.assignedPractitionerId : pickPractitioner(slot.practitionerIds, date, others)!;
    appt.startsAt = slot.startsAt;
    appt.endsAt = slot.endsAt;
    return clone(appt);
  },
  listPatients: async () => clone(db().account.savedPatients),
  savePatient: async (input) => {
    await latency();
    const list = db().account.savedPatients;
    if (input.id) {
      const existing = list.find((p) => p.id === input.id) ?? notFound("Patient profile");
      Object.assign(existing, input);
      return clone(existing);
    }
    const created = { ...input, id: `pat_fam_${Date.now()}` };
    list.push(created);
    return clone(created);
  },
  deletePatient: async (id) => {
    await latency();
    const store = db();
    if (store.account.savedPatients.find((p) => p.id === id)?.relationship === "SELF") {
      throw new ApiError(422, "VALIDATION_FAILED", "Your own profile cannot be removed.");
    }
    store.account.savedPatients = store.account.savedPatients.filter((p) => p.id !== id);
  },
  getMembership: async () => clone(db().account.membership),
  purchaseMembership: async (planId, method) => {
    await latency(500);
    const store = db();
    const plan = store.plans.find((p) => p.id === planId) ?? notFound("Plan");
    if (method !== "CASH" && method !== "MANUAL") {
      throw new ApiError(503, "PROVIDER_NOT_CONFIGURED", "Online payment is not available yet. Please choose pay at clinic or manual bKash/Nagad transfer.");
    }
    // Membership stays PENDING_PAYMENT until staff verify payment — access is NOT granted here.
    store.account.membership = {
      status: "PENDING_PAYMENT",
      planId: plan.id,
      planName: plan.name,
      startsAt: null,
      endsAt: null,
      entitlements: {},
    };
    store.payments.unshift({
      id: `pay_m_${Date.now()}`,
      createdAt: new Date().toISOString(),
      payerName: store.account.profile.fullName,
      purpose: "MEMBERSHIP",
      reference: `MEM-${plan.slug.toUpperCase()}`,
      method,
      amount: plan.price,
      status: "PENDING_VERIFICATION",
    });
    store.members.unshift({
      id: `mem_demo_${Date.now()}`,
      userName: store.account.profile.fullName,
      phone: store.account.profile.phone,
      planName: plan.name,
      status: "PENDING_PAYMENT",
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + plan.durationDays * 86_400_000).toISOString(),
    });
    return clone(store.account.membership);
  },
  listPayments: async () => {
    await latency();
    const store = db();
    const name = store.account.profile.fullName;
    return clone(store.payments.filter((p) => p.payerName === name || p.payerName === demoPatientUser.fullName));
  },
  updateProfile: async (input) => {
    await latency();
    const store = db();
    store.account.profile = { ...store.account.profile, ...input };
    return sessionUserFrom({ id: demoPatientUser.id, fullName: input.fullName, roles: ["PATIENT"] });
  },
};
