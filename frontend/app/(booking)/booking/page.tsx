import type { Metadata } from "next";
import { DemoNotice } from "@/components/ui/placeholder";
import { BookingWizard } from "@/features/booking/booking-wizard";
import { api } from "@/services";
import { getSession } from "@/services/session";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description: "Book physiotherapy or a consultancy appointment at Femur in about a minute.",
};

export default async function BookingPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const [{ service }, services, settings, session] = await Promise.all([searchParams, api.catalog.listServices(), api.cms.getSettings(), getSession()]);
  return (
    <div className="container-page py-8 sm:py-12">
      <DemoNotice className="mb-8">Availability and prices are simulated in demo mode. Bookings are kept in this browser tab only.</DemoNotice>
      <BookingWizard
        services={services}
        initialServiceSlug={service ?? null}
        isSignedIn={!!session}
        clinicAddress={settings.contact.addressLines.join(", ")}
        clinicPhone={settings.contact.phone}
      />
    </div>
  );
}
