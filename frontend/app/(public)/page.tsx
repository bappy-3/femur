import { CtaBand } from "@/components/sections/cta-band";
import { ArticlesPreview } from "@/features/home/articles-preview";
import { BookingSteps } from "@/features/home/booking-steps";
import { FaqPreview, LocationSection } from "@/features/home/faq-location";
import { Hero } from "@/features/home/hero";
import { MaternalJourney } from "@/features/home/maternal-journey";
import { ConsultancySection } from "@/features/home/consultancy";
import { OtherServices } from "@/features/home/other-services";
import { SpecialistsPreview } from "@/features/home/specialists-preview";
import { Testimonials } from "@/features/home/testimonials";
import { WhyFemurSection } from "@/features/home/why-femur";
import { env } from "@/config/env";
import { api } from "@/services";

export const revalidate = 300;

/**
 * Maternal-first homepage. Deliberately short: hero, the three stages, other physiotherapy services,
 * why Femur, visiting specialists, the team, how booking works, stories, articles, FAQ + location, and one closing call to action.
 */
export default async function HomePage() {
  const [home, settings, services, practitioners, testimonials, faqs] = await Promise.all([
    api.cms.getHome(),
    api.cms.getSettings(),
    api.catalog.listServices(),
    api.practitioners.list(),
    api.cms.listTestimonials(),
    api.cms.listFaqs(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PhysicalTherapy",
    name: settings.clinicName,
    description: "Women's and maternal physiotherapy: pre-pregnancy, pregnancy and postnatal care.",
    url: env.siteUrl,
    telephone: settings.contact.phone,
    email: settings.contact.email,
    address: { "@type": "PostalAddress", streetAddress: settings.contact.addressLines[0], addressLocality: "Dhaka", addressCountry: "BD" },
    image: home.hero.image.src,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero content={home.hero} />
      <MaternalJourney />
      <OtherServices services={services} />
      <WhyFemurSection content={home.whyFemur} />
      <ConsultancySection services={services.filter((s) => s.kind === "CONSULTANCY")} />
      <SpecialistsPreview practitioners={practitioners} />
      <BookingSteps steps={home.bookingSteps} />
      <Testimonials items={testimonials} />
      <ArticlesPreview />
      <FaqPreview faqs={faqs} />
      <LocationSection settings={settings} />
      <CtaBand title={home.finalCta.title} body={home.finalCta.body} />
    </>
  );
}
