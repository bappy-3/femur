import type { Metadata } from "next";
import { ContactDetails, MapEmbed } from "@/components/sections/contact-panel";
import { brandImagery } from "@/config/brand";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/features/home/contact-form";
import { api } from "@/services";

export const revalidate = 300;
export const metadata: Metadata = { title: "Contact", description: "Contact Femur Physiotherapy & Wellness Center in Uttara, Dhaka." };

export default async function ContactPage() {
  const settings = await api.cms.getSettings();
  return (
    <>
      <PageHero image={brandImagery.contact} eyebrow="Contact" title="We're here to help" intro="Call, WhatsApp or send us a message. For appointments, online booking is the fastest option." />
      <section className="py-16 sm:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <ContactDetails settings={settings} />
          <div className="rounded-[1.25rem] border border-line bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-medium text-teal-deep">Send a message</h2>
            <p className="mt-1 mb-6 text-sm text-ink-soft">Please don&apos;t include detailed medical information in this form.</p>
            <ContactForm />
          </div>
        </div>
        <div className="container-page mt-12">
          <MapEmbed query={settings.contact.mapQuery} className="h-96 w-full rounded-[1.25rem] border border-line bg-mist" />
        </div>
      </section>
    </>
  );
}
