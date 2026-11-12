"use client";

import {
  BadgePercent,
  CalendarDays,
  CalendarRange,
  CreditCard,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  ListChecks,
  ReceiptText,
  Stethoscope,
  UserRound,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/** Icons are resolved client-side by key so server layouts can pass plain data. */
const ICONS = {
  dashboard: LayoutDashboard,
  calendar: CalendarRange,
  appointments: ListChecks,
  patients: Users,
  practitioners: Stethoscope,
  services: HeartHandshake,
  pricing: BadgePercent,
  cms: FileText,
  finance: Wallet,
  overview: LayoutDashboard,
  myAppointments: CalendarDays,
  membership: CreditCard,
  family: UsersRound,
  payments: ReceiptText,
  profile: UserRound,
} satisfies Record<string, LucideIcon>;

export type NavIconKey = keyof typeof ICONS;
export interface SideNavItem {
  label: string;
  href: string;
  icon: NavIconKey;
  exact?: boolean;
}

function isActive(pathname: string, item: SideNavItem) {
  return item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function SideNav({ items }: { items: SideNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Section" className="space-y-0.5">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-white text-teal-deep shadow-sm" : "text-ink-soft hover:bg-white/60 hover:text-ink",
            )}
          >
            <Icon className={cn("size-[1.05rem]", active ? "text-teal" : "text-ink-soft/80")} strokeWidth={1.8} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Horizontal scrolling tabs for mobile. */
export function MobileSectionNav({ items }: { items: SideNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Section" className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:hidden">
      {items.map((item) => {
        const Icon = ICONS[item.icon];
        const active = isActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium",
              active ? "border-teal bg-teal text-white" : "border-line bg-white text-ink-soft",
            )}
          >
            <Icon className="size-4" /> {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
