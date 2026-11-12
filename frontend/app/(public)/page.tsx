import { CtaBand } from "@/components/sections/cta-band";
import { ApproachSection } from "@/features/home/approach";
import { BookingSteps } from "@/features/home/booking-steps";
import { ConsultancySection } from "@/features/home/consultancy";
import { CoreServices } from "@/features/home/core-services";
import { FaqPreview, LocationSection } from "@/features/home/faq-location";
import { Hero } from "@/features/home/hero";
import { Highlights } from "@/features/home/highlights";
import { MembershipIntro } from "@/features/home/membership-intro";
import { SpecialistsPreview } from "@/features/home/specialists-preview";
import { Testimonials } from "@/features/home/testimonials";
import { WhyFemurSection } from "@/features/home/why-femur";
import { api } from "@/services";

export const revalidate = 300;

export default async function HomePage() {
  const [home, settings, physio, consultancy, practitioners, plans, testimonials, faqs] = await Promise.all([
    api.cms.getHome(),
    api.cms.getSettings(),
    api.catalog.listServices({ kind: "PHYSIOTHERAPY" }),
    api.catalog.listServices({ kind: "CONSULTANCY" }),
    api.practitioners.list(),
    api.pricing.listPlans(),
    api.cms.listTestimonials(),
    api.cms.listFaqs(),
  ]);

  return (
    <>
      <Hero content={home.hero} />
      <Highlights items={home.highlights} />
      <CoreServices services={physio} />
      <WhyFemurSection content={home.whyFemur} />
      <ApproachSection content={home.approach} />
      <SpecialistsPreview practitioners={practitioners} />
      <BookingSteps steps={home.bookingSteps} />
      <MembershipIntro plans={plans} />
      <ConsultancySection services={consultancy} />
      <Testimonials items={testimonials} />
      <FaqPreview faqs={faqs} />
      <LocationSection settings={settings} />
      <CtaBand title={home.finalCta.title} body={home.finalCta.body} />
    </>
  );
}
