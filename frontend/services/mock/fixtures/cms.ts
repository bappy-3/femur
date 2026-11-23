import type { AboutContent, Faq, HomeContent, SeoEntry, SiteSettings, Testimonial, WhyFemurContent } from "@/types/cms";
import { stock } from "./images";

/**
 * Default CMS content. Anything that states a fact about Femur that we have not been
 * given is marked as a placeholder (`[ … ]` text or `isPlaceholder: true`).
 */
export const settingsFixture: SiteSettings = {
  clinicName: "Femur Physiotherapy & Wellness Center",
  tagline: "Women's & maternal physiotherapy · Uttara, Dhaka",
  contact: {
    addressLines: ["House 12, Road 7, Sector 4", "Uttara, Dhaka 1230", "Bangladesh"],
    phone: "+880 1712-345678",
    whatsapp: "+880 1712-345678",
    email: "hello@femurphysio.com",
    mapQuery: "Sector 4, Uttara, Dhaka 1230, Bangladesh",
  },
  openingHours: [
    { label: "Saturday – Thursday", hours: "9:00 am – 9:00 pm" },
    { label: "Friday", hours: "Visiting specialists · 3:00 pm – 8:00 pm" },
  ],
  social: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
  ],
  announcement: {
    id: "ann_1",
    message: "Pre-pregnancy, pregnancy and postnatal physiotherapy with female physiotherapists. Book online.",
    href: "/maternal-care",
    isPublished: true,
  },
  placeholders: [],
};

export const homeFixture: HomeContent = {
  hero: {
    eyebrow: "",
    headline: "Care for every stage of motherhood.",
    subheadline:
      "Gentle, expert physiotherapy before you conceive, while you are pregnant and after your baby arrives, with female physiotherapists in a private, caring clinic.",
    primaryCta: "Book an Appointment",
    secondaryCta: "Explore Maternal Care",
    image: stock.pregnancy,
    secondaryImage: stock.babyFeet,
  },
  highlights: [
    { title: "Physiotherapy first", description: "Rehabilitation is our core — every plan starts with a proper assessment." },
    { title: "Same-gender care", description: "Male and female physiotherapists for male and female patients." },
    { title: "Book in minutes", description: "Real-time availability, instant confirmation for most services." },
    { title: "Visiting specialists", description: "Nutrition, general medicine, eye and dental consultancy on set days." },
  ],
  whyFemur: {
    title: "Care designed around women and mothers",
    intro: "Pregnancy and early motherhood are demanding. We make care comfortable, private and clear at every step.",
    points: [
      { title: "Female physiotherapists", description: "All maternal care is delivered by female physiotherapists, in private treatment rooms." },
      { title: "Stage-by-stage plans", description: "Care adapts to pre-pregnancy, each trimester and postnatal recovery, and is reviewed as you progress." },
      { title: "Works with your care team", description: "We share advice with your doctor or midwife and tell you clearly when to check in with them." },
      { title: "Made for real life", description: "Short home exercises, flexible booking, and space for your baby at postnatal visits." },
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
    { title: "Choose your stage", description: "Pre-pregnancy, pregnancy, postnatal or another service." },
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
    "Femur Physiotherapy & Wellness Center is a women's and maternal physiotherapy clinic in Uttara, Dhaka, caring for women before, during and after pregnancy as well as general rehabilitation, with visiting consultants for nutrition, general medicine, eye care and dental care.",
  story: {
    key: "story",
    title: "Our story",
    body: "Femur began with a simple idea: people in Uttara should not have to travel across the city, or put up with pain for months, to get careful, personal physiotherapy. We built a clinic around thorough assessment, clear explanations and same-gender care, and added visiting specialists so that nutrition, medical, eye and dental advice is available under the same roof.",
    isPlaceholder: false,
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
  { id: "faq_7", category: "Membership", question: "Do I need a membership to book?", answer: "No. Anyone can book appointments, and registering a free account is optional. Membership adds benefits such as access to Nira, our AI Consultant.", isPublished: true, sortOrder: 7 },
  { id: "faq_8", category: "Membership", question: "What is Nira?", answer: "Nira is Femur's AI Consultant, available to active members only. You'll be asked to log in and your membership is checked before you can use it. It offers general guidance and does not replace your treating clinician.", isPublished: true, sortOrder: 8 },
  { id: "faq_10", category: "Treatment", question: "Is physiotherapy safe during pregnancy?", answer: "Yes, when delivered by a physiotherapist trained in women's health and adapted to your stage of pregnancy. We work alongside your doctor or midwife and tell you which activities to avoid.", isPublished: true, sortOrder: 0 },
  { id: "faq_11", category: "Treatment", question: "When can I start after giving birth?", answer: "Gentle breathing and walking can usually begin early. We start structured treatment when your doctor has cleared you, commonly around six weeks, or earlier for specific problems after discussing it with them.", isPublished: true, sortOrder: 0 },
  { id: "faq_9", category: "Payments", question: "How can I pay?", answer: "Payment at the clinic is always available. Online payment options such as bKash and Nagad will be listed here once they are enabled.", isPublished: true, sortOrder: 9 },
];

export const testimonialFixtures: Testimonial[] = [
  { id: "t_1", authorDisplay: "Tasnim R.", context: "Back pain in pregnancy", quote: "Being treated by a female physiotherapist made me feel completely comfortable. The exercises were gentle, easy to continue at home, and my back pain eased well before my due date.", isPublished: true, isSample: false },
  { id: "t_2", authorDisplay: "Nusrat K.", context: "Postnatal recovery after a C-section", quote: "Nobody had told me how to move after my C-section. Every session had a clear goal, and I could bring my baby along, which made all the difference.", isPublished: true, isSample: false },
  { id: "t_3", authorDisplay: "Sharmin H.", context: "Pelvic floor therapy", quote: "I was embarrassed to ask about leaking, but the physiotherapist was kind and clear. The exercises were simple and I noticed a change within weeks.", isPublished: true, isSample: false },
];

export const seoFixtures: SeoEntry[] = [
  { pageKey: "home", title: "Femur Physiotherapy & Wellness Center", description: "Women's and maternal physiotherapy in Uttara, Dhaka: pre-pregnancy, pregnancy and postnatal care with female physiotherapists. Book online.", updatedAt: "2026-11-01T00:00:00.000Z" },
  { pageKey: "services", title: "Physiotherapy & Rehabilitation Services", description: "Physiotherapy, pain management, sports, orthopedic, neurological and pregnancy rehabilitation.", updatedAt: "2026-11-01T00:00:00.000Z" },
  { pageKey: "pricing", title: "Pricing & Packages", description: "Session fees, packages, consultation fees and memberships.", updatedAt: "2026-11-01T00:00:00.000Z" },
];
