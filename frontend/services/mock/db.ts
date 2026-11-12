/**
 * In-memory store for MOCK MODE. One instance per JS runtime (browser tab or server process).
 * Data resets on reload — mutations are NOT persisted. Never used when NEXT_PUBLIC_API_MODE=live.
 */
import type { CommissionRecord, PatientRecord, PaymentRecord } from "@/types/admin";
import type { Appointment } from "@/types/appointment";
import type { Service } from "@/types/catalog";
import type { AboutContent, Faq, HomeContent, SeoEntry, SiteSettings, Testimonial, WhyFemurContent } from "@/types/cms";
import type { MemberRecord, MembershipPlan, MembershipState, PriceItem } from "@/types/membership";
import type { CommissionRule, Practitioner, TimeBlock } from "@/types/practitioner";
import type { SavedPatient } from "@/types/user";
import { serviceFixtures } from "./fixtures/catalog";
import { aboutFixture, faqFixtures, homeFixture, seoFixtures, settingsFixture, testimonialFixtures, whyFemurFixture } from "./fixtures/cms";
import { demoPatientUser } from "./fixtures/people";
import { commissionRuleFixtures, practitionerFixtures } from "./fixtures/practitioners";
import { membershipPlanFixtures, priceItemFixtures } from "./fixtures/pricing";
import { DEMO_SELF_PATIENT_ID, mulberry32, seedOperationalData } from "./seed";

export interface MockDb {
  services: Service[];
  practitioners: Practitioner[];
  priceItems: PriceItem[];
  plans: MembershipPlan[];
  settings: SiteSettings;
  home: HomeContent;
  about: AboutContent;
  whyFemur: WhyFemurContent;
  faqs: Faq[];
  testimonials: Testimonial[];
  seo: SeoEntry[];
  patients: PatientRecord[];
  appointments: Appointment[];
  blocks: TimeBlock[];
  payments: PaymentRecord[];
  commissions: CommissionRecord[];
  commissionRules: CommissionRule[];
  members: MemberRecord[];
  account: {
    profile: { fullName: string; email: string | null; phone: string };
    savedPatients: SavedPatient[];
    membership: MembershipState;
  };
  rand: () => number;
}

const clone = <T,>(v: T): T => structuredClone(v);

function createDb(): MockDb {
  const now = new Date();
  const services = clone(serviceFixtures);
  const practitioners = clone(practitionerFixtures);
  const ops = seedOperationalData(now, services, practitioners);
  return {
    services,
    practitioners,
    priceItems: clone(priceItemFixtures),
    plans: clone(membershipPlanFixtures),
    settings: clone(settingsFixture),
    home: clone(homeFixture),
    about: clone(aboutFixture),
    whyFemur: clone(whyFemurFixture),
    faqs: clone(faqFixtures),
    testimonials: clone(testimonialFixtures),
    seo: clone(seoFixtures),
    ...ops,
    blocks: [],
    commissionRules: clone(commissionRuleFixtures),
    account: {
      profile: { fullName: demoPatientUser.fullName, email: demoPatientUser.email, phone: demoPatientUser.phone },
      savedPatients: [
        { id: DEMO_SELF_PATIENT_ID, fullName: demoPatientUser.fullName, gender: "MALE", dateOfBirth: null, ageYears: 32, phone: demoPatientUser.phone, email: demoPatientUser.email, relationship: "SELF" },
        { id: "pat_demo_parent", fullName: "Demo Parent", gender: "FEMALE", dateOfBirth: null, ageYears: 61, phone: demoPatientUser.phone, email: null, relationship: "PARENT" },
      ],
      membership: { status: "NONE", planId: null, planName: null, startsAt: null, endsAt: null, entitlements: {} },
    },
    rand: mulberry32(now.getTime() % 100000),
  };
}

const globalKey = "__femurMockDb" as const;
type GlobalWithDb = typeof globalThis & { [globalKey]?: MockDb };

export function db(): MockDb {
  const g = globalThis as GlobalWithDb;
  g[globalKey] ??= createDb();
  return g[globalKey]!;
}
