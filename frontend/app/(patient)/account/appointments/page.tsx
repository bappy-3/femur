import type { Metadata } from "next";
import { MyAppointments } from "@/features/account/my-appointments";

export const metadata: Metadata = { title: "My appointments" };

export default function Page() {
  return <MyAppointments />;
}
