import type { Metadata } from "next";
import { AdminCalendar } from "@/features/admin-calendar/admin-calendar";

export const metadata: Metadata = { title: "Calendar" };

export default function Page() {
  return <AdminCalendar />;
}
