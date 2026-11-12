import { ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/layout/portal-shell";
import type { SideNavItem } from "@/components/navigation/side-nav";
import { ButtonLink } from "@/components/ui/button";
import { ToastProvider } from "@/components/ui/toast";
import { routes } from "@/config/site";
import { SignOutButton } from "@/features/auth/sign-out-button";
import { getSession, isStaff } from "@/services/session";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false, follow: false } };

const NAV: SideNavItem[] = [
  { label: "Dashboard", href: routes.admin.root, icon: "dashboard", exact: true },
  { label: "Calendar", href: routes.admin.calendar, icon: "calendar" },
  { label: "Appointments", href: routes.admin.appointments, icon: "appointments" },
  { label: "Patients", href: routes.admin.patients, icon: "patients" },
  { label: "Practitioners", href: routes.admin.practitioners, icon: "practitioners" },
  { label: "Services", href: routes.admin.services, icon: "services" },
  { label: "Pricing & membership", href: routes.admin.pricing, icon: "pricing" },
  { label: "Website CMS", href: routes.admin.cms, icon: "cms" },
  { label: "Finance & commissions", href: routes.admin.finance, icon: "finance" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect(`${routes.login}?next=${routes.admin.root}`);
  if (!isStaff(user)) {
    // UX guard only — every admin endpoint is also protected by backend RBAC.
    return (
      <main className="grid min-h-dvh place-items-center px-4">
        <div className="max-w-md text-center">
          <ShieldAlert className="mx-auto size-10 text-rose" />
          <h1 className="mt-4 text-3xl font-medium text-teal-deep">Staff access only</h1>
          <p className="mt-2 text-ink-soft">Your account doesn&apos;t have permission to open the admin portal.</p>
          <ButtonLink href={routes.account.root} className="mt-6">
            Go to my account
          </ButtonLink>
        </div>
      </main>
    );
  }
  return (
    <ToastProvider>
      <PortalShell wide title="Clinic operations" nav={NAV} user={{ name: user.fullName, caption: user.roles.join(", ").toLowerCase() }} signOut={<SignOutButton />}>
        {children}
      </PortalShell>
    </ToastProvider>
  );
}
