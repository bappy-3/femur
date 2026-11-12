import type { AboutContent, Faq, HomeContent, SeoEntry, SiteSettings, Testimonial, WhyFemurContent } from "@/types/cms";
import { stock } from "./images";

/**
 * Default CMS content. Anything that states a fact about Femur that we have not been
 * given is marked as a placeholder (`[ … ]` text or `isPlaceholder: true`).
 */
export const settingsFixture: SiteSettings = {
  clinicName: "Femur Physiotherapy & Wellness Center",
  tagline: "Physiotherapy & Wellness · Uttara, Dhaka",
  contact: {
    addressLines: ["[House / Road — to be confirmed]", "Sector [–], Uttara", "Dhaka 1230, Bangladesh"],
    phone: "+880 1XXX-XXXXXX",
    whatsapp: "+880 1XXX-XXXXXX",
    email: "hello@femurphysio.com",
    mapQuery: "Uttara, Dhaka, Bangladesh",
  },
  openingHours: [
    { label: "Saturday – Thursday", hours: "9:00 am – 9:00 pm" },
    { label: "Friday", hours: "Visiting specialists only" },
  ],
  social: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
  ],
  announcement: {
    id: "ann_1",
    message: "Visiting specialist days for Eye Care and Dental are now bookable online.",
    href: "/services",
    isPublished: true,
  },
  placeholders: ["contact.addressLines", "contact.phone", "contact.whatsapp", "contact.email", "openingHours"],
};

export const homeFixture: HomeContent = {
  hero: {
    eyebrow: "Physiotherapy & Wellness · Uttara, Dhaka",
    headline: "Move Better. Live Better.",
    subheadline:
      "Personalized physiotherapy and wellness care to help you move comfortably, recover confidently, and live healthier.",
    primaryCta: "Book an Appointment",
    secondaryCta: "Explore Our Services",
    image: stock.manualTherapy,
    secondaryImage: stock.exerciseMat,
  },
  highlights: [
    { title: "Physiotherapy first", description: "Rehabilitation is our core — every plan starts with a proper assessment." },
    { title: "Same-gender care", description: "Male and female physiotherapists for male and female patients." },
    { title: "Book in minutes", description: "Real-time availability, instant confirmation for most services." },
    { title: "Visiting specialists", description: "Nutrition, general medicine, eye and dental consultancy on set days." },
  ],
  whyFemur: {
    title: "Care that is planned around you",
    intro: "We combine careful assessment, hands-on treatment and clear communication so you always know what comes next.",
    points: [
      { title: "Personalised treatment plans", description: "Your plan is built from your assessment, goals and daily life — and adjusted as you improve." },
      { title: "Patient-focused rehabilitation", description: "We explain the why behind every exercise so you can take an active part in recovery." },
      { title: "Respectful, comfortable care", description: "Same-gender physiotherapists and a calm, private treatment environment." },
      { title: "Integrated wellness", description: "Nutrition and medical consultancy under one roof when your recovery needs it." },
    ],
  },
  approach: {
    title: "Our approach to recovery",
    intro: "A clear, four-stage path from your first visit to lasting results.",
    steps: [
      { title: "Assess", description: "A thorough conversation and movement assessment to understand the cause, not just the symptom." },
      { title: "Plan", description: "Clear goals and a realistic timeline agreed together with you." },
      { title: "Treat", description: "Hands-on therapy and progressive exercise, adjusted session by session." },
      { title: "Sustain", description: "A home programme and habits that keep you moving well after discharge." },
    ],
    image: stock.consultation,
  },
  bookingSteps: [
    { title: "Choose a service", description: "Physiotherapy, rehabilitation or a consultancy visit." },
    { title: "Tell us who it's for", description: "Book for yourself or a family member in under a minute." },
    { title: "Pick a time", description: "Only genuinely available slots are shown." },
    { title: "Get confirmation", description: "Receive your appointment reference instantly." },
  ],
  finalCta: {
    title: "Ready to take the first step?",
    body: "Book an assessment with a Femur physiotherapist. It takes about a minute.",
  },
};

export const aboutFixture: AboutContent = {
  intro:
    "Femur Physiotherapy & Wellness Center is a physiotherapy and rehabilitation clinic in Uttara, Dhaka, with visiting consultants for nutrition, general medicine, eye care and dental care.",
  story: {
    key: "story",
    title: "Our story",
    body: "[Placeholder — Femur's founding story, founders and milestones will be added here by the clinic. We have intentionally not invented any history.]",
    isPlaceholder: true,
  },
  mission: {
    key: "mission",
    title: "Our mission",
    body: "To help people in Uttara and across Dhaka move comfortably and live actively through careful assessment, personalised physiotherapy and respectful, patient-centred care.",
    isPlaceholder: false,
  },
  vision: {
    key: "vision",
    title: "Our vision",
    body: "A community where quality rehabilitation is accessible, understandable and part of everyday health — not something people turn to only as a last resort.",
    isPlaceholder: false,
  },
  values: [
    { title: "Respect", description: "Privacy, dignity and same-gender care as standard." },
    { title: "Clarity", description: "Plain explanations, realistic goals, no surprises." },
    { title: "Evidence", description: "Treatment guided by assessment and current best practice." },
    { title: "Partnership", description: "Recovery is something we do with you, not to you." },
  ],
  philosophy: {
    key: "philosophy",
    title: "Our philosophy of care",
    body: "We treat people, not just painful joints. Understanding how you live, work and move lets us design care that fits your life — and gives you the knowledge to keep progressing between sessions.",
    isPlaceholder: false,
  },
  recoveryApproach: homeFixture.approach.steps,
  image: stock.clinicianWithPatient,
};

export const whyFemurFixture: WhyFemurContent = {
  intro:
    "Choosing where to recover matters. Here is what you can expect at Femur — described plainly, without exaggerated claims.",
  differentiators: [
    { icon: "clipboard", title: "Personalised treatment plans", description: "Every plan starts from a full assessment and is reviewed as you progress, rather than following a one-size-fits-all routine." },
    { icon: "heart", title: "Patient-focused rehabilitation", description: "You'll understand your condition, your goals and the purpose of each exercise." },
    { icon: "shield", title: "Professional physiotherapy care", description: "Treatment delivered by qualified physiotherapists, with clinical notes kept private and secure." },
    { icon: "users", title: "Same-gender practitioners", description: "Male patients are seen by male physiotherapists and female patients by female physiotherapists." },
    { icon: "calendar", title: "Structured appointment management", description: "Online booking with real availability, reminders and easy rescheduling." },
    { icon: "leaf", title: "Comfortable clinical environment", description: "A calm, clean and private space designed for treatment and exercise." },
    { icon: "plus", title: "Integrated wellness consultancy", description: "Visiting nutrition, general medicine, eye and dental consultants on scheduled days." },
  ],
};

export const faqFixtures: Faq[] = [
  { id: "faq_1", category: "Booking", question: "How do I book an appointment?", answer: "Use the Book an Appointment button anywhere on the site. Choose a service, tell us who the appointment is for, and pick an available time. You'll receive a reference number immediately.", isPublished: true, sortOrder: 1 },
  { id: "faq_2", category: "Booking", question: "Can I book for a family member?", answer: "Yes. During booking you can enter the details of the person attending. Registered users can also save family members for faster booking next time.", isPublished: true, sortOrder: 2 },
  { id: "faq_3", category: "Treatment", question: "Will I be treated by a male or female physiotherapist?", answer: "For physiotherapy services, male patients are seen by male physiotherapists and female patients by female physiotherapists. Pregnancy rehabilitation is provided by female physiotherapists only.", isPublished: true, sortOrder: 3 },
  { id: "faq_4", category: "Treatment", question: "What should I bring to my first session?", answer: "Comfortable clothing, any recent medical reports or imaging, and a list of current medications. Please arrive about 10 minutes early.", isPublished: true, sortOrder: 4 },
  { id: "faq_5", category: "Booking", question: "Are the specialist consultants available every day?", answer: "No. Our nutrition, general medicine, eye care and dental consultants visit on scheduled days. The booking page only shows days when they are available.", isPublished: true, sortOrder: 5 },
  { id: "faq_6", category: "Booking", question: "How do I cancel or reschedule?", answer: "Registered users can cancel or reschedule from My Account, subject to the cancellation window for the service. You can also call the clinic.", isPublished: true, sortOrder: 6 },
  { id: "faq_7", category: "Membership", question: "Do I need a membership to book?", answer: "No. Anyone can book appointments, and registering a free account is optional. Membership adds benefits such as access to Nira, our AI wellness assistant.", isPublished: true, sortOrder: 7 },
  { id: "faq_8", category: "Membership", question: "What is Nira?", answer: "Nira is Femur's AI wellness assistant for members. It provides general health and physiotherapy information and helps with booking — it does not diagnose or replace your clinician.", isPublished: true, sortOrder: 8 },
  { id: "faq_9", category: "Payments", question: "How can I pay?", answer: "Payment at the clinic is always available. Online payment options such as bKash and Nagad will be listed here once they are enabled.", isPublished: true, sortOrder: 9 },
];

export const testimonialFixtures: Testimonial[] = [
  { id: "t_1", authorDisplay: "Sample patient", context: "Lower back pain", quote: "[Sample testimonial — will be replaced with a real, consented patient review.] The plan was explained clearly and the exercises fit into my workday.", isPublished: true, isSample: true },
  { id: "t_2", authorDisplay: "Sample patient", context: "Post-operative knee rehabilitation", quote: "[Sample testimonial — placeholder.] I always knew what the next step was, which made the recovery far less stressful.", isPublished: true, isSample: true },
  { id: "t_3", authorDisplay: "Sample patient", context: "Pregnancy rehabilitation", quote: "[Sample testimonial — placeholder.] Being treated by a female physiotherapist made me feel completely comfortable.", isPublished: true, isSample: true },
];

export const seoFixtures: SeoEntry[] = [
  { pageKey: "home", title: "Femur Physiotherapy & Wellness Center — Uttara, Dhaka", description: "Personalised physiotherapy, rehabilitation and wellness consultancy in Uttara, Dhaka. Book online.", updatedAt: "2026-11-01T00:00:00.000Z" },
  { pageKey: "services", title: "Physiotherapy & Rehabilitation Services", description: "Physiotherapy, pain management, sports, orthopedic, neurological and pregnancy rehabilitation.", updatedAt: "2026-11-01T00:00:00.000Z" },
  { pageKey: "pricing", title: "Pricing & Packages", description: "Session fees, packages, consultation fees and memberships.", updatedAt: "2026-11-01T00:00:00.000Z" },
];
