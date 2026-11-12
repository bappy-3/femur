/**
 * Live adapter — talks to the NestJS backend (`/api/v1`). Endpoints follow docs/api/API_CONTRACTS.md.
 * Public CMS/catalog reads use ISR (revalidate + tags) so the backend can purge via /api/revalidate.
 */
import type { FemurApi } from "../contracts";
import { request, type RequestOptions } from "../http/client";

const PUBLIC: RequestOptions = { next: { revalidate: 300, tags: ["cms"] } };
const NO_STORE = { cache: "no-store" as const };

export const liveApi: FemurApi = {
  cms: {
    getSettings: () => request("/cms/settings", PUBLIC),
    getHome: () => request("/cms/pages/home", PUBLIC),
    getAbout: () => request("/cms/pages/about", PUBLIC),
    getWhyFemur: () => request("/cms/pages/why-femur", PUBLIC),
    listFaqs: () => request("/cms/faqs", PUBLIC),
    listTestimonials: () => request("/cms/testimonials", PUBLIC),
  },
  catalog: {
    listServices: (filter) => request("/services", { ...PUBLIC, query: { kind: filter?.kind } }),
    getService: (slug) => request(`/services/${encodeURIComponent(slug)}`, PUBLIC),
  },
  practitioners: { list: () => request("/practitioners", PUBLIC) },
  pricing: {
    listPriceItems: () => request("/pricing", PUBLIC),
    listPlans: () => request("/membership-plans", PUBLIC),
  },
  availability: {
    listDates: (q) => request("/availability/dates", { ...NO_STORE, query: { ...q } }),
    listSlots: (q) => request("/availability/slots", { ...NO_STORE, query: { ...q } }),
  },
  appointments: {
    create: (input, idempotencyKey) => request("/appointments", { method: "POST", body: input, idempotencyKey }),
  },
  auth: {
    login: (input) => request("/auth/login", { method: "POST", body: input }),
    register: (input) => request("/auth/register", { method: "POST", body: input }),
    logout: () => request("/auth/logout", { method: "POST" }),
    me: () => request("/auth/me", NO_STORE),
    requestPasswordReset: (identifier) => request("/auth/password/forgot", { method: "POST", body: { identifier } }),
  },
  account: {
    listAppointments: () => request("/me/appointments", NO_STORE),
    cancelAppointment: (id, reason) => request(`/me/appointments/${id}/cancel`, { method: "POST", body: { reason } }),
    rescheduleAppointment: (id, startsAt) => request(`/me/appointments/${id}/reschedule`, { method: "POST", body: { startsAt } }),
    listPatients: () => request("/me/patients", NO_STORE),
    savePatient: ({ id, ...body }) =>
      id ? request(`/me/patients/${id}`, { method: "PATCH", body }) : request("/me/patients", { method: "POST", body }),
    deletePatient: (id) => request(`/me/patients/${id}`, { method: "DELETE" }),
    getMembership: () => request("/me/membership", NO_STORE),
    purchaseMembership: (planId, paymentMethod) => request("/me/memberships", { method: "POST", body: { planId, paymentMethod } }),
    listPayments: () => request("/me/payments", NO_STORE),
    updateProfile: (input) => request("/me/profile", { method: "PATCH", body: input }),
  },
  admin: {
    dashboard: (range) => request("/admin/dashboard", { ...NO_STORE, query: range }),
    calendar: (q) =>
      request("/admin/calendar", { ...NO_STORE, query: { date: q.date, days: q.days, practitionerIds: q.practitionerIds, serviceId: q.serviceId } }),
    listAppointments: (f) => request("/admin/appointments", { ...NO_STORE, query: f }),
    createAppointment: (input) => request("/admin/appointments", { method: "POST", body: input }),
    updateStatus: (id, to, reason) => request(`/admin/appointments/${id}/status`, { method: "PATCH", body: { to, reason } }),
    reschedule: (id, input) => request(`/admin/appointments/${id}/reschedule`, { method: "POST", body: input }),
    setTreatingPractitioner: (id, practitionerId) =>
      request(`/admin/appointments/${id}/assign`, { method: "POST", body: { practitionerId, kind: "TREATING" } }),
    createBlock: (input) => request("/admin/time-blocks", { method: "POST", body: input }),
    deleteBlock: (id) => request(`/admin/time-blocks/${id}`, { method: "DELETE" }),
    listPatients: (q) => request("/admin/patients", { ...NO_STORE, query: { q } }),
    getPatient: (id) => request(`/admin/patients/${id}`, NO_STORE),
    createPatient: (input) => request("/admin/patients", { method: "POST", body: input }),
    addPatientNote: (id, body) => request(`/admin/patients/${id}/notes`, { method: "POST", body: { body } }),
    listPractitioners: () => request("/admin/practitioners", NO_STORE),
    savePractitioner: (p) => request(`/admin/practitioners/${p.id}`, { method: "PUT", body: p }),
    listServices: () => request("/admin/services", NO_STORE),
    saveService: (s) => request(`/admin/services/${s.id}`, { method: "PUT", body: s }),
    listPriceItems: () => request("/admin/price-items", NO_STORE),
    savePriceItem: (i) => request(`/admin/price-items/${i.id}`, { method: "PUT", body: i }),
    listPlans: () => request("/admin/membership-plans", NO_STORE),
    savePlan: (p) => request(`/admin/membership-plans/${p.id}`, { method: "PUT", body: p }),
    listMembers: () => request("/admin/memberships", NO_STORE),
    setMemberStatus: (id, action) => request(`/admin/memberships/${id}/${action}`, { method: "POST" }),
    saveSettings: (s) => request("/admin/cms/settings", { method: "PUT", body: s }),
    saveHome: (h) => request("/admin/cms/pages/home", { method: "PUT", body: h }),
    listFaqs: () => request("/admin/cms/faqs", NO_STORE),
    saveFaq: (f) => request(`/admin/cms/faqs/${f.id}`, { method: "PUT", body: f }),
    deleteFaq: (id) => request(`/admin/cms/faqs/${id}`, { method: "DELETE" }),
    listTestimonials: () => request("/admin/cms/testimonials", NO_STORE),
    saveTestimonial: (t) => request(`/admin/cms/testimonials/${t.id}`, { method: "PUT", body: t }),
    listSeo: () => request("/admin/cms/seo", NO_STORE),
    saveSeo: (e) => request(`/admin/cms/seo/${e.pageKey}`, { method: "PUT", body: e }),
    listPayments: (f) => request("/admin/payments", { ...NO_STORE, query: f }),
    verifyPayment: (id) => request(`/admin/payments/${id}/verify`, { method: "POST" }),
    listCommissions: (f) => request("/admin/commissions", { ...NO_STORE, query: f }),
    overrideCommission: (id, amount, reason) => request(`/admin/commissions/${id}/override`, { method: "POST", body: { amount, reason } }),
    settleCommissions: (ids) => request("/admin/commission-settlements", { method: "POST", body: { commissionIds: ids } }),
    listCommissionRules: () => request("/admin/commission-rules", NO_STORE),
    saveCommissionRule: (r) => request(`/admin/commission-rules/${r.id}`, { method: "PUT", body: r }),
    providerStatus: () => request("/admin/integrations/status", NO_STORE),
  },
};
