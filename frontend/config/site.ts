
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
  { label: "Services", href: routes.services },
  { label: "Specialists", href: routes.specialists },
  { label: "Pricing", href: routes.pricing },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
  { label: "Become a Member", href: routes.membership },
] as const;

export const footerNav = {
  Clinic: [
    { label: "About us", href: routes.about },
    { label: "Our story", href: routes.ourStory },
    { label: "Why Femur", href: routes.whyFemur },
    { label: "Specialists", href: routes.specialists },
  ],
  Care: [
    { label: "All services", href: routes.services },
    { label: "Pricing", href: routes.pricing },
    { label: "Become a member", href: routes.membership },
    { label: "Nira (members)", href: routes.nira },
    { label: "Book an appointment", href: routes.booking },
  ],
  Help: [
    { label: "FAQ", href: routes.faq },
    { label: "Contact", href: routes.contact },
    { label: "My account", href: routes.account.root },
  ],
} as const;

export const SESSION_COOKIE = "femur_sid";
export const DEMO_SESSION_COOKIE = "femur_demo_session";
