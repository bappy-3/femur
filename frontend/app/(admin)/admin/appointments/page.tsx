import type { Metadata } from "next";
import { AppointmentsList } from "@/features/admin/appointments-list";

export const metadata: Metadata = { title: "Appointments" };

export default function Page() {
  return <AppointmentsList />;
}
