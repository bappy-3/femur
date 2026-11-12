import type { Metadata } from "next";
import { AccountOverview } from "@/features/account/account-overview";
import { getSession } from "@/services/session";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await getSession();
  return <AccountOverview firstName={user?.fullName.split(" ")[0] ?? "there"} />;
}
