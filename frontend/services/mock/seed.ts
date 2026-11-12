/**
 * Deterministic demo data generator for MOCK MODE.
 * Generates ~3 weeks of appointments that respect practitioner schedules, plus payments,
 * commission snapshots and membership records — so the admin portal can be reviewed realistically.
 */
import { addDays, dhakaDateTimeToUtc, dhakaToday } from "@/lib/datetime";
import { percentOf } from "@/lib/money";
import type { CommissionRecord, PatientRecord, PaymentRecord } from "@/types/admin";
import type { Appointment, AppointmentStatus, PaymentStatus } from "@/types/appointment";
import type { Service } from "@/types/catalog";
import type { Money } from "@/types/common";
import type { MemberRecord } from "@/types/membership";
import type { Practitioner } from "@/types/practitioner";
import { calculateCommission, describeRule, resolveRule } from "./commission";
import { commissionRuleFixtures } from "./fixtures/practitioners";
import { demoPatientUser, demoPeople } from "./fixtures/people";
import { priceItemFixtures } from "./fixtures/pricing";
import { workingIntervals } from "./scheduling";

export function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export function makeReference(rand: () => number): string {
  const part = () => Array.from({ length: 4 }, () => ALPHABET[Math.floor(rand() * ALPHABET.length)]).join("");
  return `FMR-${part()}-${part()}`;
}

export function listPriceFor(service: Service): Money | null {
  const item = priceItemFixtures.find((p) => p.serviceId === service.id && (p.kind === "SESSION" || p.kind === "CONSULTATION"));
  return item?.amount ?? service.startingPrice;
}

export const DEMO_SELF_PATIENT_ID = "pat_demo_self";

export function seedOperationalData(now: Date, services: Service[], practitioners: Practitioner[]) {
  const rand = mulberry32(20261112);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]!;
  const today = dhakaToday(now);

  const patients: PatientRecord[] = demoPeople.map((p, i) => ({
    id: p.id,
    fullName: p.fullName,
    gender: p.gender,
    ageYears: p.ageYears,
    phone: p.phone,
    email: null,
    medicalRecordNo: `MRN-${String(1001 + i)}`,
    registeredAt: dhakaDateTimeToUtc(addDays(today, -60 - i * 3), 600).toISOString(),
    isWalkIn: i % 5 === 0,
    membershipStatus: i % 6 === 0 ? "ACTIVE" : "NONE",
    lastVisit: null,
    totalVisits: 0,
    internalNotes: [],
  }));
  patients.push({
    id: DEMO_SELF_PATIENT_ID, fullName: demoPatientUser.fullName, gender: "MALE", ageYears: 32, phone: demoPatientUser.phone,
    email: demoPatientUser.email, medicalRecordNo: "MRN-0999", registeredAt: dhakaDateTimeToUtc(addDays(today, -40), 600).toISOString(),
    isWalkIn: false, membershipStatus: "NONE", lastVisit: null, totalVisits: 0, internalNotes: [],
  });

  const appointments: Appointment[] = [];
  const payments: PaymentRecord[] = [];
  const commissions: CommissionRecord[] = [];
  const demoDays = new Set<number>();

  for (let d = -14; d <= 10; d++) {
    const date = addDays(today, d);
    const density = d < 0 ? 0.62 : d === 0 ? 0.6 : Math.max(0.12, 0.5 - d * 0.04);
    for (const p of practitioners) {
      const offered = services.filter((s) => p.serviceIds.includes(s.id));
      for (const iv of workingIntervals(p, date)) {
        let t = iv.start;
        while (t < iv.end) {
          const service = pick(offered);
          const duration = service.rules.durationMinutes;
          if (t + duration > iv.end) break;
          const isDemoVisit = (d === -6 || d === 2) && p.id === "prc_physio_m1" && service.id === "svc_physiotherapy" && !demoDays.has(d);
          if (isDemoVisit || rand() < density) {
            const pool = patients.filter((x) => x.id !== DEMO_SELF_PATIENT_ID && (service.rules.genderPolicy === "NONE" || x.gender === p.gender));
            const eligible = service.rules.eligibleGenders.length ? pool.filter((x) => service.rules.eligibleGenders.includes(x.gender)) : pool;
            if (isDemoVisit) demoDays.add(d);
            const patient = isDemoVisit ? patients.find((x) => x.id === DEMO_SELF_PATIENT_ID)! : pick(eligible.length ? eligible : pool);
            const startsAt = dhakaDateTimeToUtc(date, t);
            const endsAt = dhakaDateTimeToUtc(date, t + duration);
            const status = statusFor(startsAt, endsAt, now, rand);
            const list = listPriceFor(service);
            const discount = list && rand() < 0.2 ? percentOf(list, 10) : null;
            const net = list ? { amount: list.amount - (discount?.amount ?? 0), currency: "BDT" as const } : null;
            const paymentStatus: PaymentStatus = status === "COMPLETED" ? (rand() < 0.85 ? "PAID" : "UNPAID") : "UNPAID";
            const appt: Appointment = {
              id: `apt_${appointments.length + 1}`,
              reference: makeReference(rand),
              status,
              source: rand() < 0.7 ? "WEB" : rand() < 0.5 ? "PHONE" : "WALK_IN",
              serviceId: service.id,
              serviceName: service.name,
              patient: { id: patient.id, fullName: patient.fullName, gender: patient.gender, ageYears: patient.ageYears, phone: patient.phone, email: patient.email, medicalRecordNo: patient.medicalRecordNo },
              assignedPractitionerId: p.id,
              treatingPractitionerId: status === "COMPLETED" ? p.id : null,
              startsAt: startsAt.toISOString(),
              endsAt: endsAt.toISOString(),
              reasonForVisit: rand() < 0.5 ? "Follow-up session" : null,
              charge: { listPrice: list, discount, net, paymentStatus },
              createdAt: new Date(startsAt.getTime() - 3 * 86_400_000).toISOString(),
            };
            appointments.push(appt);

            if (status === "COMPLETED") {
              patient.totalVisits += 1;
              if (!patient.lastVisit || appt.startsAt > patient.lastVisit) patient.lastVisit = appt.startsAt;
              if (net && paymentStatus === "PAID") {
                payments.push({ id: `pay_${payments.length + 1}`, createdAt: appt.endsAt, payerName: patient.fullName, purpose: "APPOINTMENT", reference: appt.reference, method: rand() < 0.6 ? "CASH" : "MANUAL", amount: net, status: "SUCCEEDED" });
              } else if (net && rand() < 0.5) {
                payments.push({ id: `pay_${payments.length + 1}`, createdAt: appt.endsAt, payerName: patient.fullName, purpose: "APPOINTMENT", reference: appt.reference, method: "MANUAL", amount: net, status: "PENDING_VERIFICATION" });
              }
              const rule = resolveRule(commissionRuleFixtures, p.id, service.id, date);
              if (rule && list && net) {
                commissions.push({
                  id: `com_${commissions.length + 1}`,
                  appointmentReference: appt.reference,
                  completedAt: appt.endsAt,
                  practitionerId: p.id,
                  practitionerName: p.displayName,
                  serviceName: service.name,
                  baseAmount: rule.base === "GROSS" ? list : net,
                  ruleLabel: describeRule(rule),
                  computedAmount: calculateCommission(rule, list, net),
                  overrideAmount: null,
                  overrideReason: null,
                  status: paymentStatus !== "PAID" ? "PENDING_PAYMENT" : d < -7 ? "SETTLED" : "PAYABLE",
                });
              }
            }
          }
          t += duration;
        }
      }
    }
  }

  const members: MemberRecord[] = patients
    .filter((p) => p.membershipStatus === "ACTIVE")
    .map((p, i) => ({
      id: `mem_${i + 1}`,
      userName: p.fullName,
      phone: p.phone,
      planName: i % 2 ? "Quarterly Care" : "Monthly Care",
      status: "ACTIVE" as const,
      startsAt: dhakaDateTimeToUtc(addDays(today, -10 - i), 600).toISOString(),
      endsAt: dhakaDateTimeToUtc(addDays(today, 20 + i * 15), 600).toISOString(),
    }));
  members.push(
    { id: "mem_x1", userName: "Sharmin H.", phone: "+8801800000205", planName: "Monthly Care", status: "EXPIRED", startsAt: dhakaDateTimeToUtc(addDays(today, -45), 600).toISOString(), endsAt: dhakaDateTimeToUtc(addDays(today, -15), 600).toISOString() },
    { id: "mem_x2", userName: "Rakib B.", phone: "+8801700000109", planName: "Monthly Care", status: "SUSPENDED", startsAt: dhakaDateTimeToUtc(addDays(today, -5), 600).toISOString(), endsAt: dhakaDateTimeToUtc(addDays(today, 25), 600).toISOString() },
    { id: "mem_x3", userName: "Lamia S.", phone: "+8801800000206", planName: "Quarterly Care", status: "PENDING_PAYMENT", startsAt: now.toISOString(), endsAt: dhakaDateTimeToUtc(addDays(today, 90), 600).toISOString() },
  );

  return { patients, appointments, payments, commissions, members };
}

function statusFor(start: Date, end: Date, now: Date, rand: () => number): AppointmentStatus {
  if (end.getTime() <= now.getTime()) {
    const r = rand();
    return r < 0.8 ? "COMPLETED" : r < 0.88 ? "NO_SHOW" : "CANCELLED";
  }
  if (start.getTime() <= now.getTime()) return "IN_PROGRESS";
  const r = rand();
  return r < 0.72 ? "CONFIRMED" : r < 0.92 ? "PENDING" : "CANCELLED";
}
