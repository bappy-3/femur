
/**
 * Structural site configuration (routes & navigation).
 * Business content (contact details, hours, copy) is NOT here — it comes from the CMS via `api.cms`.
 */
export const routes = {
  home: "/",
  about: "/about",
  ourStory: "/our-story",
  whyFemur: "/about#why-femur",
  services: "/services",
  service: (slug: string) => `/services/${slug}`,
  maternal: "/maternal-care",
  conditions: "/conditions",
  condition: (slug: string) => `/conditions/${slug}`,
  treatments: "/treatments",
  treatment: (slug: string) => `/treatments/${slug}`,
  blog: "/blog",
  article: (slug: string) => `/blog/${slug}`,
  homeVisit: "/home-physiotherapy",
  specialists: "/specialists",
  pricing: "/pricing",
  membership: "/membership",
  faq: "/faq",
  contact: "/contact",
  booking: "/booking",
  bookingFor: (serviceSlug: string) => `/booking?service=${encodeURIComponent(serviceSlug)}`,
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  account: {
    root: "/account",
    appointments: "/account/appointments",
    membership: "/account/membership",
    family: "/account/family",
    payments: "/account/payments",
    profile: "/account/profile",
  },
  admin: {
    root: "/admin",
    calendar: "/admin/calendar",
    appointments: "/admin/appointments",
    patients: "/admin/patients",
    patient: (id: string) => `/admin/patients/${id}`,
    practitioners: "/admin/practitioners",
    practitioner: (id: string) => `/admin/practitioners/${id}`,
    services: "/admin/services",
    pricing: "/admin/pricing",
    cms: "/admin/cms",
    finance: "/admin/finance",
  },
  /** Members-only gateway page on this site; the Nira app itself lives at env.niraUrl. */
  nira: "/nira",
} as const;

export const mainNav = [
  { label: "Maternal Care", href: routes.maternal },
  { label: "Services", href: routes.services },
  { label: "Conditions", href: routes.conditions },
  { label: "Specialists", href: routes.specialists },
  { label: "Pricing", href: routes.pricing },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
  { label: "Become a Member", href: routes.membership }, // ADR-015: stays top-level
] as const;

/** Extra links shown in the mobile menu only (desktop surfaces these in the footer / homepage). */
export const mobileNavExtra = [
  { label: "Treatments", href: routes.treatments },
  { label: "Health blog", href: routes.blog },
  { label: "Home physiotherapy", href: routes.homeVisit },
] as const;

export const footerNav = {
  Clinic: [
    { label: "About us", href: routes.about },
    { label: "Our story", href: routes.ourStory },
    { label: "Why Femur", href: routes.whyFemur },
    { label: "Specialists", href: routes.specialists },
  ],
  Care: [
    { label: "Maternal care", href: routes.maternal },
    { label: "All services", href: routes.services },
    { label: "Conditions we treat", href: routes.conditions },
    { label: "Treatments & technology", href: routes.treatments },
    { label: "Home physiotherapy", href: routes.homeVisit },
    { label: "Pricing", href: routes.pricing },
    { label: "Become a member", href: routes.membership },
    { label: "Nira (members)", href: routes.nira },
    { label: "Book an appointment", href: routes.booking },
  ],
  Help: [
    { label: "Health blog", href: routes.blog },
    { label: "FAQ", href: routes.faq },
    { label: "Contact", href: routes.contact },
    { label: "My account", href: routes.account.root },
  ],
} as const;

export const SESSION_COOKIE = "femur_sid";
export const DEMO_SESSION_COOKIE = "femur_demo_session";
