import type { ImageAsset } from "./common";

export interface Faq {
  q: string;
  a: string;
}

/** A body area / complaint patients search for ("Knee pain", "Migraine"). Primary language English, Bangla secondary. */
export interface Condition {
  slug: string;
  name: string;
  /** Bangla name, shown as a secondary line. */
  bn: string;
  group: "Pre-pregnancy" | "Pregnancy" | "Postnatal" | "Spine" | "Upper limb" | "Lower limb" | "Head & nerves" | "Whole body";
  summary: string;
  bnSummary: string;
  image: ImageAsset;
  overview: string;
  symptoms: string[];
  commonCauses: string[];
  /** Plain-language steps of how Femur approaches this complaint. */
  approach: string[];
  /** Slugs from content/treatments.ts that may be used, after assessment. */
  treatmentSlugs: string[];
  /** Slug of a bookable service in the catalogue. */
  serviceSlug: string;
  /** Red flags: when to seek medical care first. */
  seeDoctorIf: string[];
  faqs: Faq[];
  relatedArticleSlugs: string[];
}

export interface Treatment {
  slug: string;
  name: string;
  bn: string;
  family: "Device-based" | "Needle-based" | "Hands-on" | "Cold therapy" | "Brain stimulation" | "Medical gas";
  summary: string;
  bnSummary: string;
  image: ImageAsset;
  overview: string;
  howItWorks: string;
  sessionLength: string;
  typicalCourse: string;
  sensation: string;
  goodFor: string[];
  /** Check with your clinician / tell us first if ... */
  tellUsFirst: string[];
  conditionSlugs: string[];
  serviceSlug: string;
  /** "core" = routinely offered; "confirm" = availability is confirmed when you book. */
  availability: "core" | "confirm";
  faqs: Faq[];
}

export interface ArticleSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Article {
  slug: string;
  title: string;
  bnTitle: string;
  excerpt: string;
  category: "Back & spine" | "Joints" | "Work & posture" | "Women's health" | "Understanding pain";
  /** ISO date (YYYY-MM-DD) */
  publishedOn: string;
  readMinutes: number;
  image: ImageAsset;
  intro: string;
  sections: ArticleSection[];
  keyPoints: string[];
  conditionSlugs: string[];
}
