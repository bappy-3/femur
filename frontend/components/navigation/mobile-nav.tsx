"use client";

import { Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface NavItem {
  label: string;
  href: string;
}

export function MobileNav({ items, niraUrl, bookingHref }: { items: readonly NavItem[]; niraUrl: string; bookingHref: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="grid size-10 place-items-center rounded-full text-teal hover:bg-mist"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      <div
        id="mobile-menu"
        className={cn(
          "absolute inset-x-0 top-full z-40 h-[calc(100dvh-4.25rem)] origin-top overflow-y-auto border-t border-line bg-cream px-4 pt-4 pb-10 transition-[opacity,transform] duration-200",
          open ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn("border-b border-line py-4 font-display text-2xl text-teal-deep", pathname.startsWith(item.href) && "text-sage")}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/account" className="border-b border-line py-4 font-display text-2xl text-teal-deep">
            My account
          </Link>
        </nav>
        <div className="mt-8 grid gap-3">
          <ButtonLink href={bookingHref} size="lg">
            Book an Appointment
          </ButtonLink>
          <ButtonAnchor href={niraUrl} variant="secondary" size="lg">
            <Sparkles className="size-4" /> Ask Nira
          </ButtonAnchor>
        </div>
      </div>
    </div>
  );
}
