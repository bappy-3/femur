import { redirect } from "next/navigation";
import { PortalShell } from "@/components/layout/portal-shell";
import type { SideNavItem } from "@/components/navigation/side-nav";
import { ToastProvider } from "@/components/ui/toast";
import { routes } from "@/config/site";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { getSession } from "@/services/session";

export const dynamic = "force-dynamic";

const NAV: SideNavItem[] = [
  { label: "Overview", href: routes.account.root, icon: "overview", exact: true },
  { label: "Appointments", href: routes.account.appointments, icon: "myAppointments" },
  { label: "Membership", href: routes.account.membership, icon: "membership" },
  { label: "Family profiles", href: routes.account.family, icon: "family" },
  { label: "Payments", href: routes.account.payments, icon: "payments" },
  { label: "Profile", href: routes.account.profile, icon: "profile" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect(`${routes.login}?next=${routes.account.root}`);
  return (
    <ToastProvider>
      <PortalShell title="My account" nav={NAV} user={{ name: user.fullName, caption: user.phone }} signOut={<SignOutButton />}>
        {children}
      </PortalShell>
    </ToastProvider>
  );
}
