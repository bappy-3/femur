import type { ID, ImageAsset, ISODateTime } from "./common";

export interface OpeningHoursRow {
  label: string; // "Saturday – Thursday"
  hours: string; // "9:00 am – 9:00 pm"
}

export interface SiteSettings {
  clinicName: string;
  tagline: string;
  contact: {
    addressLines: string[];
    phone: string;
    whatsapp: string;
    email: string;
    mapQuery: string;
  };
  openingHours: OpeningHoursRow[];
  social: { label: string; href: string }[];
  announcement: { id: ID; message: string; href: string | null; isPublished: boolean } | null;
  /** True for values still awaiting confirmation by Femur — rendered with a placeholder marker */
  placeholders: string[];
}

export interface HeroContent {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  image: ImageAsset;
  secondaryImage: ImageAsset;
}

export interface Highlight {
  title: string;
  description: string;
}

export interface HomeContent {
  hero: HeroContent;
  highlights: Highlight[];
  whyFemur: { title: string; intro: string; points: Highlight[] };
  approach: { title: string; intro: string; steps: Highlight[]; image: ImageAsset };
  bookingSteps: Highlight[];
  finalCta: { title: string; body: string };
}

export interface StoryBlock {
  key: string;
  title: string;
  body: string;
  isPlaceholder: boolean;
}

export interface AboutContent {
  intro: string;
  story: StoryBlock;
  mission: StoryBlock;
  vision: StoryBlock;
  values: Highlight[];
  philosophy: StoryBlock;
  recoveryApproach: Highlight[];
  image: ImageAsset;
}

export interface WhyFemurContent {
  intro: string;
  differentiators: (Highlight & { icon: string })[];
}

export interface Faq {
  id: ID;
  category: "Booking" | "Treatment" | "Membership" | "Payments" | "General";
  question: string;
  answer: string;
  isPublished: boolean;
  sortOrder: number;
}

export interface Testimonial {
  id: ID;
  authorDisplay: string;
  context: string;
  quote: string;
  isPublished: boolean;
  isSample: boolean;
}

export interface SeoEntry {
  pageKey: string;
  title: string;
  description: string;
  updatedAt: ISODateTime;
}
