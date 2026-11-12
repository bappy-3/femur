import type { Metadata } from "next";
import { MyProfile } from "@/features/account/payments-and-profile";

export const metadata: Metadata = { title: "Profile" };

export default function Page() {
  return <MyProfile />;
}
