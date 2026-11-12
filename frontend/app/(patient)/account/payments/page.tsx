import type { Metadata } from "next";
import { MyPayments } from "@/features/account/payments-and-profile";

export const metadata: Metadata = { title: "Payments" };

export default function Page() {
  return <MyPayments />;
}
