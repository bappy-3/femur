/**
 * Adapter contracts. Every data source (live backend, mock fixtures) implements `FemurApi`.
 * Mirrors docs/api/API_CONTRACTS.md. Add methods here first, then implement in api/ and mock/.
 */
import type { CalendarData, CalendarQuery, CommissionRecord, CommissionStatus, DashboardSummary, PatientRecord, PaymentMethod, PaymentRecord, ProviderStatus } from "@/types/admin";
import type { Appointment, AppointmentConfirmation, AppointmentStatus, AvailabilitySlot, AvailableDate, CreateAppointmentInput } from "@/types/appointment";
import type { Service, ServiceKind } from "@/types/catalog";
import type { AboutContent, Faq, HomeContent, SeoEntry, SiteSettings, Testimonial, WhyFemurContent } from "@/types/cms";
import type { Gender, ID, ISODate, ISODateTime } from "@/types/common";
import type { MemberRecord, MembershipPlan, MembershipState, PriceItem } from "@/types/membership";
import type { CommissionRule, Practitioner, TimeBlock } from "@/types/practitioner";
import type { LoginInput, RegisterInput, SavedPatient, SessionUser } from "@/types/user";

export interface CmsApi {
  getSettings(): Promise<SiteSettings>;
  getHome(): Promise<HomeContent>;
  getAbout(): Promise<AboutContent>;
  getWhyFemur(): Promise<WhyFemurContent>;
  listFaqs(): Promise<Faq[]>;
  listTestimonials(): Promise<Testimonial[]>;
}

export interface CatalogApi {
  listServices(filter?: { kind?: ServiceKind }): Promise<Service[]>;
  getService(slug: string): Promise<Service | null>;
}

export interface PractitionersApi {
  list(): Promise<Practitioner[]>;
}

export interface PricingApi {
  listPriceItems(): Promise<PriceItem[]>;
  listPlans(): Promise<MembershipPlan[]>;
}

export interface AvailabilityApi {
  listDates(q: { serviceId: ID; gender: Gender; from: ISODate; days: number }): Promise<AvailableDate[]>;
  listSlots(q: { serviceId: ID; gender: Gender; date: ISODate }): Promise<AvailabilitySlot[]>;
}

export interface AppointmentsApi {
  create(input: CreateAppointmentInput, idempotencyKey: string): Promise<AppointmentConfirmation>;
}

export interface AuthApi {
  login(input: LoginInput): Promise<SessionUser>;
  register(input: RegisterInput): Promise<SessionUser>;
  logout(): Promise<void>;
  me(): Promise<SessionUser | null>;
  requestPasswordReset(identifier: string): Promise<void>;
}

export interface AccountApi {
  listAppointments(): Promise<Appointment[]>;
  cancelAppointment(id: ID, reason: string | null): Promise<Appointment>;
  rescheduleAppointment(id: ID, startsAt: ISODateTime): Promise<Appointment>;
  listPatients(): Promise<SavedPatient[]>;
  savePatient(patient: Omit<SavedPatient, "id"> & { id?: ID }): Promise<SavedPatient>;
  deletePatient(id: ID): Promise<void>;
  getMembership(): Promise<MembershipState>;
  purchaseMembership(planId: ID, method: PaymentMethod): Promise<MembershipState>;
  listPayments(): Promise<PaymentRecord[]>;
  updateProfile(input: { fullName: string; email: string | null }): Promise<SessionUser>;
}

export interface AdminCreateAppointmentInput extends CreateAppointmentInput {
  practitionerId: ID;
  source: "ADMIN" | "WALK_IN" | "PHONE";
  overrideReason: string | null;
}

export interface AdminApi {
  dashboard(range: { from: ISODate; to: ISODate }): Promise<DashboardSummary>;
  calendar(q: CalendarQuery): Promise<CalendarData>;
  listAppointments(filter: { from: ISODate; to: ISODate; status?: AppointmentStatus | ""; q?: string }): Promise<Appointment[]>;
  createAppointment(input: AdminCreateAppointmentInput): Promise<Appointment>;
  updateStatus(id: ID, to: AppointmentStatus, reason: string | null): Promise<Appointment>;
  reschedule(id: ID, input: { startsAt: ISODateTime; practitionerId: ID }): Promise<Appointment>;
  setTreatingPractitioner(id: ID, practitionerId: ID): Promise<Appointment>;
  createBlock(input: Omit<TimeBlock, "id">): Promise<TimeBlock>;
  deleteBlock(id: ID): Promise<void>;

  listPatients(q: string): Promise<PatientRecord[]>;
  getPatient(id: ID): Promise<{ patient: PatientRecord; appointments: Appointment[]; payments: PaymentRecord[] } | null>;
  createPatient(input: { fullName: string; gender: Gender; ageYears: number | null; phone: string; email: string | null }): Promise<PatientRecord>;
  addPatientNote(id: ID, body: string): Promise<PatientRecord>;

  listPractitioners(): Promise<Practitioner[]>;
  savePractitioner(p: Practitioner): Promise<Practitioner>;
  listServices(): Promise<Service[]>;
  saveService(s: Service): Promise<Service>;

  listPriceItems(): Promise<PriceItem[]>;
  savePriceItem(item: PriceItem): Promise<PriceItem>;
  listPlans(): Promise<MembershipPlan[]>;
  savePlan(plan: MembershipPlan): Promise<MembershipPlan>;
  listMembers(): Promise<MemberRecord[]>;
  setMemberStatus(id: ID, action: "activate" | "suspend" | "resume" | "cancel"): Promise<MemberRecord>;

  saveSettings(s: SiteSettings): Promise<SiteSettings>;
  saveHome(h: HomeContent): Promise<HomeContent>;
  listFaqs(): Promise<Faq[]>;
  saveFaq(f: Faq): Promise<Faq>;
  deleteFaq(id: ID): Promise<void>;
  listTestimonials(): Promise<Testimonial[]>;
  saveTestimonial(t: Testimonial): Promise<Testimonial>;
  listSeo(): Promise<SeoEntry[]>;
  saveSeo(e: SeoEntry): Promise<SeoEntry>;

  listPayments(filter: { from: ISODate; to: ISODate }): Promise<PaymentRecord[]>;
  verifyPayment(id: ID): Promise<PaymentRecord>;
  listCommissions(filter: { from: ISODate; to: ISODate; practitionerId?: ID | ""; status?: CommissionStatus | "" }): Promise<CommissionRecord[]>;
  overrideCommission(id: ID, amount: number, reason: string): Promise<CommissionRecord>;
  settleCommissions(ids: ID[]): Promise<CommissionRecord[]>;
  listCommissionRules(): Promise<CommissionRule[]>;
  saveCommissionRule(rule: CommissionRule): Promise<CommissionRule>;
  providerStatus(): Promise<ProviderStatus[]>;
}

export interface FemurApi {
  cms: CmsApi;
  catalog: CatalogApi;
  practitioners: PractitionersApi;
  pricing: PricingApi;
  availability: AvailabilityApi;
  appointments: AppointmentsApi;
  auth: AuthApi;
  account: AccountApi;
  admin: AdminApi;
}
