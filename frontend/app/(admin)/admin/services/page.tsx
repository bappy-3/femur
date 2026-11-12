import type { Metadata } from "next";
import { ServicesAdmin } from "@/features/admin/services-admin";

export const metadata: Metadata = { title: "Services" };

export default function Page() {
  return <ServicesAdmin />;
}
