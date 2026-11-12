import type { Metadata } from "next";
import { FamilyProfiles } from "@/features/account/family-profiles";

export const metadata: Metadata = { title: "Family profiles" };

export default function Page() {
  return <FamilyProfiles />;
}
