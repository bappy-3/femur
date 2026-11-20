"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

interface NavItem {
  label: string;
  href: string;
}

/** Desktop navigation. The current section is marked with a filled pill, a green bar and aria-current. */
export function MainNav({ items }: { items: readonly NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative rounded-full px-3.5 py-2 text-[0.9rem] font-medium whitespace-nowrap transition-colors",
              active ? "bg-mint-soft text-teal-deep" : "text-ink-soft hover:bg-mist hover:text-teal-deep",
            )}
          >
            {item.label}
            <span
              aria-hidden
              className={cn("absolute inset-x-5 -bottom-[0.7rem] h-0.5 rounded-full bg-teal transition-opacity", active ? "opacity-100" : "opacity-0")}
            />
          </Link>
        );
      })}
    </nav>
  );
}
