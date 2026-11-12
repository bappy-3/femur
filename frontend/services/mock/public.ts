import { dhakaToday } from "@/lib/datetime";
import type { AppointmentsApi, AvailabilityApi, CatalogApi, CmsApi, PractitionersApi, PricingApi } from "../contracts";
import { db } from "./db";
import { computeSlots, dateRange } from "./scheduling";
import { bookAppointment, clone, findService, latency, practitionerName } from "./shared";

export const mockCms: CmsApi = {
  getSettings: async () => clone(db().settings),
  getHome: async () => clone(db().home),
  getAbout: async () => clone(db().about),
  getWhyFemur: async () => clone(db().whyFemur),
  listFaqs: async () => clone(db().faqs.filter((f) => f.isPublished).sort((a, b) => a.sortOrder - b.sortOrder)),
  listTestimonials: async () => clone(db().testimonials.filter((t) => t.isPublished)),
};

export const mockCatalog: CatalogApi = {
  listServices: async (filter) => {
    await latency(80);
    return clone(
      db()
        .services.filter((s) => s.isActive && (!filter?.kind || s.kind === filter.kind))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    );
  },
  getService: async (slug) => clone(db().services.find((s) => s.slug === slug && s.isActive) ?? null),
};

export const mockPractitioners: PractitionersApi = {
  list: async () => clone(db().practitioners.filter((p) => p.isActive && p.isPublic)),
};

export const mockPricing: PricingApi = {
  listPriceItems: async () => clone(db().priceItems.filter((p) => p.isPublished).sort((a, b) => a.sortOrder - b.sortOrder)),
  listPlans: async () => clone(db().plans.filter((p) => p.isActive && p.isPublic).sort((a, b) => a.sortOrder - b.sortOrder)),
};

export const mockAvailability: AvailabilityApi = {
  listDates: async ({ serviceId, gender, from, days }) => {
    await latency(260);
    const store = db();
    const service = findService(serviceId);
    const now = new Date();
    const start = from < dhakaToday(now) ? dhakaToday(now) : from;
    return dateRange(start, days).map((date) => ({
      date,
      hasSlots: computeSlots({ service, gender, date, practitioners: store.practitioners, appointments: store.appointments, blocks: store.blocks, now }).length > 0,
    }));
  },
  listSlots: async ({ serviceId, gender, date }) => {
    await latency(240);
    const store = db();
    const service = findService(serviceId);
    return computeSlots({ service, gender, date, practitioners: store.practitioners, appointments: store.appointments, blocks: store.blocks, now: new Date() }).map(
      ({ startsAt, endsAt, availableCount }) => ({ startsAt, endsAt, availableCount }),
    );
  },
};

export const mockAppointments: AppointmentsApi = {
  create: async (input) => {
    await latency(500);
    const appt = bookAppointment(input, { source: "WEB" });
    return {
      id: appt.id,
      reference: appt.reference,
      status: appt.status,
      serviceName: appt.serviceName,
      practitionerName: practitionerName(appt.assignedPractitionerId),
      startsAt: appt.startsAt,
      endsAt: appt.endsAt,
      patientName: appt.patient.fullName,
      charge: appt.charge,
      // Honest reporting: no notification provider is connected in mock mode.
      notifications: [
        { channel: "SMS", status: "NOT_CONFIGURED" },
        { channel: "EMAIL", status: "NOT_CONFIGURED" },
        { channel: "WHATSAPP", status: "NOT_CONFIGURED" },
      ],
    };
  },
};
