import type { Metadata } from "next";
import { PricingAdmin } from "@/features/admin/pricing-admin";

export const metadata: Metadata = { title: "Pricing & membership" };

export default function Page() {
  return <PricingAdmin />;
}
