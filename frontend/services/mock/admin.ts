import { canTransition } from "@/lib/appointment-status";
import { addDays, daysBetween, dhakaToday, minutesToTime, toDhakaDate } from "@/lib/datetime";
import { sumMoney } from "@/lib/money";
import type { DashboardSummary } from "@/types/admin";
import { ACTIVE_STATUSES } from "@/types/appointment";
import type { AdminApi } from "../contracts";
import { ApiError } from "../http/client";
import { db } from "./db";
import { dateRange, hasConflict, workingIntervals } from "./scheduling";
import { bookAppointment, clone, latency, notFound, snapshotCommission } from "./shared";

const inRange = (iso: string, from: string, to: string) => {
  const d = toDhakaDate(iso);
  return d >= from && d <= to;
};

function upsert<T extends { id: string }>(list: T[], item: T): T {
  const i = list.findIndex((x) => x.id === item.id);
  if (i >= 0) list[i] = clone(item);
  else list.push(clone(item));
  return clone(item);
}

function findAppointment(id: string) {
  return db().appointments.find((a) => a.id === id) ?? notFound("Appointment");
}

export const mockAdmin: AdminApi = {
  async dashboard({ from, to }) {
    await latency();
    const store = db();
    const today = dhakaToday();
    const appts = store.appointments.filter((a) => inRange(a.startsAt, from, to));
    const paid = store.payments.filter((p) => p.status === "SUCCEEDED" && inRange(p.createdAt, from, to));
    const days = Math.min(daysBetween(from, to) + 1, 31);
    const summary: DashboardSummary = {
      date: today,
      todayCount: store.appointments.filter((a) => toDhakaDate(a.startsAt) === today && a.status !== "CANCELLED").length,
      upcomingCount: store.appointments.filter((a) => toDhakaDate(a.startsAt) > today && ACTIVE_STATUSES.includes(a.status)).length,
      completedCount: appts.filter((a) => a.status === "COMPLETED").length,
      pendingCount: store.appointments.filter((a) => a.status === "PENDING").length,
      cancelledCount: appts.filter((a) => a.status === "CANCELLED" || a.status === "NO_SHOW").length,
      revenue: sumMoney(paid.map((p) => p.amount)),
      outstanding: sumMoney(appts.filter((a) => a.status === "COMPLETED" && a.charge.paymentStatus !== "PAID" && a.charge.net).map((a) => a.charge.net!)),
      activeMemberships: store.members.filter((m) => m.status === "ACTIVE").length,
      revenueByDay: dateRange(addDays(to, -(days - 1)), days).map((date) => ({
        date,
        amount: paid.filter((p) => toDhakaDate(p.createdAt) === date).reduce((s, p) => s + p.amount.amount, 0),
      })),
      appointmentsByService: Object.entries(
        appts.reduce<Record<string, number>>((acc, a) => ((acc[a.serviceName] = (acc[a.serviceName] ?? 0) + 1), acc), {}),
      )
        .map(([serviceName, count]) => ({ serviceName, count }))
        .sort((a, b) => b.count - a.count),
      practitionerLoad: store.practitioners.map((p) => ({
        practitionerId: p.id,
        name: p.displayName,
        completed: appts.filter((a) => (a.treatingPractitionerId ?? a.assignedPractitionerId) === p.id && a.status === "COMPLETED").length,
        scheduled: appts.filter((a) => a.assignedPractitionerId === p.id && ACTIVE_STATUSES.includes(a.status)).length,
      })),
    };
    return summary;
  },

  async calendar({ date, days, practitionerIds, serviceId }) {
    await latency(180);
    const store = db();
    const dates = dateRange(date, days);
    const last = dates[dates.length - 1]!;
    const practitioners = store.practitioners.filter(
      (p) => p.isActive && (!practitionerIds?.length || practitionerIds.includes(p.id)) && (!serviceId || p.serviceIds.includes(serviceId)),
    );
    const ids = new Set(practitioners.map((p) => p.id));
    const availability = practitioners.flatMap((p) =>
      dates.map((d) => ({ practitionerId: p.id, date: d, ranges: workingIntervals(p, d).map((i) => ({ start: minutesToTime(i.start), end: minutesToTime(i.end) })) })),
    );
    const allStarts = availability.flatMap((a) => a.ranges.map((r) => r.start)).sort();
    const allEnds = availability.flatMap((a) => a.ranges.map((r) => r.end)).sort();
    const floorHour = (t: string | undefined, fb: string) => (t ? `${t.slice(0, 2)}:00` : fb);
    const ceilHour = (t: string | undefined, fb: string) => (t ? (t.endsWith(":00") ? t : `${String(Number(t.slice(0, 2)) + 1).padStart(2, "0")}:00`) : fb);
    return clone({
      practitioners,
      appointments: store.appointments.filter((a) => ids.has(a.assignedPractitionerId) && inRange(a.startsAt, date, last) && (!serviceId || a.serviceId === serviceId)),
      blocks: store.blocks.filter((b) => (b.practitionerId === null || ids.has(b.practitionerId)) && inRange(b.startsAt, date, last)),
      availability,
      clinicHours: { start: floorHour(allStarts[0], "09:00"), end: ceilHour(allEnds[allEnds.length - 1], "21:00") },
    });
  },

  async listAppointments({ from, to, status, q }) {
    await latency();
    const needle = q?.trim().toLowerCase();
    return clone(
      db()
        .appointments.filter(
          (a) =>
            inRange(a.startsAt, from, to) &&
            (!status || a.status === status) &&
            (!needle || a.patient.fullName.toLowerCase().includes(needle) || a.reference.toLowerCase().includes(needle) || a.patient.phone.includes(needle)),
        )
        .sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    );
  },

  async createAppointment(input) {
    await latency(350);
    return clone(bookAppointment(input, { practitionerId: input.practitionerId, source: input.source, overrideReason: input.overrideReason, initialStatus: "CONFIRMED" }));
  },

  async updateStatus(id, to, reason) {
    await latency();
    const appt = findAppointment(id);
    if (!canTransition(appt.status, to)) throw new ApiError(409, "INVALID_STATUS_TRANSITION", `Cannot change ${appt.status} to ${to}.`);
    if (to === "IN_PROGRESS" || to === "COMPLETED" || to === "NO_SHOW") {
      if (new Date(appt.startsAt).getTime() - Date.now() > 30 * 60_000) {
        throw new ApiError(409, "INVALID_STATUS_TRANSITION", "This appointment hasn't started yet.");
      }
    }
    appt.status = to;
    if (to === "COMPLETED") snapshotCommission(appt);
    if (reason) appt.reasonForVisit = appt.reasonForVisit ? `${appt.reasonForVisit} · Staff note: ${reason}` : `Staff note: ${reason}`;
    return clone(appt);
  },

  async reschedule(id, { startsAt, practitionerId }) {
    await latency(300);
    const store = db();
    const appt = findAppointment(id);
    if (appt.status !== "PENDING" && appt.status !== "CONFIRMED") throw new ApiError(409, "INVALID_STATUS_TRANSITION", "Only pending or confirmed appointments can be moved.");
    const duration = new Date(appt.endsAt).getTime() - new Date(appt.startsAt).getTime();
    const endsAt = new Date(new Date(startsAt).getTime() + duration).toISOString();
    const practitioner = store.practitioners.find((p) => p.id === practitionerId) ?? notFound("Practitioner");
    if (!practitioner.serviceIds.includes(appt.serviceId)) throw new ApiError(422, "VALIDATION_FAILED", `${practitioner.displayName} does not offer ${appt.serviceName}.`);
    const service = store.services.find((s) => s.id === appt.serviceId)!;
    if (service.rules.genderPolicy === "REQUIRED_SAME_GENDER" && practitioner.gender !== appt.patient.gender) {
      throw new ApiError(422, "VALIDATION_FAILED", "This service requires a practitioner of the same gender as the patient.");
    }
    if (hasConflict(practitionerId, startsAt, endsAt, store.appointments, store.blocks, appt.id)) {
      throw new ApiError(409, "SLOT_TAKEN", "That time overlaps another appointment or blocked time.");
    }
    Object.assign(appt, { startsAt, endsAt, assignedPractitionerId: practitionerId });
    return clone(appt);
  },

  async setTreatingPractitioner(id, practitionerId) {
    await latency();
    const appt = findAppointment(id);
    appt.treatingPractitionerId = practitionerId;
    return clone(appt);
  },

  async createBlock(input) {
    await latency();
    const store = db();
    const block = { ...input, id: `blk_${Date.now()}` };
    store.blocks.push(block);
    return clone(block);
  },
  async deleteBlock(id) {
    await latency();
    const store = db();
    store.blocks = store.blocks.filter((b) => b.id !== id);
  },

  async listPatients(q) {
    await latency();
    const needle = q.trim().toLowerCase();
    return clone(
      db()
        .patients.filter((p) => !needle || p.fullName.toLowerCase().includes(needle) || p.phone.includes(needle) || p.medicalRecordNo.toLowerCase().includes(needle))
        .sort((a, b) => (b.lastVisit ?? "").localeCompare(a.lastVisit ?? "")),
    );
  },
  async getPatient(id) {
    await latency();
    const store = db();
    const patient = store.patients.find((p) => p.id === id);
    if (!patient) return null;
    const appointments = store.appointments.filter((a) => a.patient.id === id).sort((a, b) => b.startsAt.localeCompare(a.startsAt));
    const refs = new Set(appointments.map((a) => a.reference));
    return clone({ patient, appointments, payments: store.payments.filter((p) => refs.has(p.reference)) });
  },
  async createPatient(input) {
    await latency();
    const store = db();
    const record = {
      ...input,
      id: `pat_walkin_${Date.now()}`,
      medicalRecordNo: `MRN-${3000 + store.patients.length}`,
      registeredAt: new Date().toISOString(),
      isWalkIn: true,
      membershipStatus: "NONE",
      lastVisit: null,
      totalVisits: 0,
      internalNotes: [],
    };
    store.patients.unshift(record);
    return clone(record);
  },
  async addPatientNote(id, body) {
    await latency();
    const p = db().patients.find((x) => x.id === id) ?? notFound("Patient");
    p.internalNotes.unshift({ id: `note_${Date.now()}`, at: new Date().toISOString(), author: "Demo Admin", body });
    return clone(p);
  },

  listPractitioners: async () => (await latency(), clone(db().practitioners)),
  savePractitioner: async (p) => (await latency(), upsert(db().practitioners, p)),
  listServices: async () => (await latency(), clone([...db().services].sort((a, b) => a.sortOrder - b.sortOrder))),
  saveService: async (s) => (await latency(), upsert(db().services, s)),
  listPriceItems: async () => (await latency(), clone([...db().priceItems].sort((a, b) => a.sortOrder - b.sortOrder))),
  savePriceItem: async (i) => (await latency(), upsert(db().priceItems, i)),
  listPlans: async () => (await latency(), clone(db().plans)),
  savePlan: async (p) => (await latency(), upsert(db().plans, p)),
  listMembers: async () => (await latency(), clone(db().members)),
  async setMemberStatus(id, action) {
    await latency();
    const m = db().members.find((x) => x.id === id) ?? notFound("Membership");
    const next = { activate: "ACTIVE", resume: "ACTIVE", suspend: "SUSPENDED", cancel: "CANCELLED" } as const;
    m.status = next[action];
    if (action === "activate") m.startsAt = new Date().toISOString();
    // Keep the demo patient's own membership in sync when staff act on it.
    const acct = db().account;
    if (m.userName === acct.profile.fullName && acct.membership.planName === m.planName) {
      const plan = db().plans.find((p) => p.name === m.planName);
      acct.membership = { ...acct.membership, status: m.status, startsAt: m.startsAt, endsAt: m.endsAt, entitlements: m.status === "ACTIVE" ? (plan?.entitlements ?? {}) : {} };
    }
    return clone(m);
  },

  saveSettings: async (s) => (await latency(), (db().settings = clone(s)), clone(s)),
  saveHome: async (h) => (await latency(), (db().home = clone(h)), clone(h)),
  listFaqs: async () => (await latency(), clone([...db().faqs].sort((a, b) => a.sortOrder - b.sortOrder))),
  saveFaq: async (f) => (await latency(), upsert(db().faqs, f)),
  deleteFaq: async (id) => {
    await latency();
    db().faqs = db().faqs.filter((f) => f.id !== id);
  },
  listTestimonials: async () => (await latency(), clone(db().testimonials)),
  saveTestimonial: async (t) => (await latency(), upsert(db().testimonials, t)),
  listSeo: async () => (await latency(), clone(db().seo)),
  async saveSeo(e) {
    await latency();
    const list = db().seo;
    const i = list.findIndex((x) => x.pageKey === e.pageKey);
    const next = { ...e, updatedAt: new Date().toISOString() };
    if (i >= 0) list[i] = next;
    else list.push(next);
    return clone(next);
  },

  async listPayments({ from, to }) {
    await latency();
    return clone(db().payments.filter((p) => inRange(p.createdAt, from, to)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },
  async verifyPayment(id) {
    await latency();
    const store = db();
    const p = store.payments.find((x) => x.id === id) ?? notFound("Payment");
    if (p.status !== "PENDING_VERIFICATION") throw new ApiError(409, "INVALID_STATUS_TRANSITION", "Only pending payments can be verified.");
    p.status = "SUCCEEDED";
    const appt = store.appointments.find((a) => a.reference === p.reference);
    if (appt) {
      appt.charge.paymentStatus = "PAID";
      store.commissions.filter((c) => c.appointmentReference === p.reference && c.status === "PENDING_PAYMENT").forEach((c) => (c.status = "PAYABLE"));
    }
    return clone(p);
  },
  async listCommissions({ from, to, practitionerId, status }) {
    await latency();
    return clone(
      db()
        .commissions.filter((c) => inRange(c.completedAt, from, to) && (!practitionerId || c.practitionerId === practitionerId) && (!status || c.status === status))
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt)),
    );
  },
  async overrideCommission(id, amount, reason) {
    await latency();
    const c = db().commissions.find((x) => x.id === id) ?? notFound("Commission");
    if (c.status === "SETTLED") throw new ApiError(409, "INVALID_STATUS_TRANSITION", "Settled commissions cannot be overridden. Create an adjustment instead.");
    if (!reason.trim()) throw new ApiError(422, "VALIDATION_FAILED", "An override reason is required.");
    c.overrideAmount = { amount, currency: "BDT" };
    c.overrideReason = reason;
    return clone(c);
  },
  async settleCommissions(ids) {
    await latency(400);
    const list = db().commissions.filter((c) => ids.includes(c.id) && c.status === "PAYABLE");
    list.forEach((c) => (c.status = "SETTLED"));
    return clone(list);
  },
  listCommissionRules: async () => (await latency(), clone(db().commissionRules)),
  async saveCommissionRule(rule) {
    await latency();
    const store = db();
    // Effective dating: never edit a rule in place — close the previous open rule for the same scope.
    const prev = store.commissionRules.find((r) => r.id !== rule.id && r.practitionerId === rule.practitionerId && r.serviceId === rule.serviceId && r.effectiveTo === null);
    if (prev && prev.effectiveFrom < rule.effectiveFrom) prev.effectiveTo = rule.effectiveFrom;
    return upsert(store.commissionRules, rule);
  },
  providerStatus: async () => [
    { key: "sms", label: "SMS gateway", configured: false },
    { key: "email", label: "Email (SMTP/SES)", configured: false },
    { key: "whatsapp", label: "WhatsApp Cloud API", configured: false },
    { key: "bkash", label: "bKash", configured: false },
    { key: "nagad", label: "Nagad", configured: false },
    { key: "gateway", label: "Card gateway", configured: false },
  ],
};
