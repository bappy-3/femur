import type { Metadata } from "next";
import { PractitionersAdmin } from "@/features/admin/practitioners";

export const metadata: Metadata = { title: "Practitioners" };

export default function Page() {
  return <PractitionersAdmin />;
}
