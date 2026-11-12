import type { Metadata } from "next";
import { MyMembership } from "@/features/account/my-membership";

export const metadata: Metadata = { title: "Membership" };

export default function Page() {
  return <MyMembership />;
}
