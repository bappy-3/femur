import type { Metadata } from "next";
import { FinanceAdmin } from "@/features/admin/finance-admin";

export const metadata: Metadata = { title: "Finance & commissions" };

export default function Page() {
  return <FinanceAdmin />;
}
