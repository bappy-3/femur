import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/media/logo";
import { MobileSectionNav, SideNav, type SideNavItem } from "@/components/navigation/side-nav";

import { Monogram } from "@/components/ui/monogram";
import { DemoNotice } from "@/components/ui/placeholder";
import { cn } from "@/lib/cn";

interface Props {
  title: string;
  nav: SideNavItem[];
  user: { name: string; caption: string };
  headerAction?: ReactNode;
  signOut: ReactNode;
  wide?: boolean;
  children: ReactNode;
}

/** Shared chrome for the patient portal and admin portal. */
export function PortalShell({ title, nav, user, headerAction, signOut, wide, children }: Props) {
  return (
    <div className="min-h-dvh bg-cream lg:grid lg:grid-cols-[15.5rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-mist/70 px-3 py-5 lg:flex">
        <Link href="/" className="px-2" aria-label="Femur home">
          <Logo />
        </Link>
        <p className="mt-7 mb-2 px-3 text-[0.68rem] font-semibold tracking-[0.16em] text-ink-soft/80 uppercase">{title}</p>
        <div className="flex-1 overflow-y-auto">
          <SideNav items={nav} />
        </div>
        <div className="mt-4 border-t border-line pt-4">
          <div className="flex items-center gap-3 px-3 pb-2">
            <Monogram name={user.name} className="size-9 text-sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
              <p className="truncate text-xs text-ink-soft">{user.caption}</p>
            </div>
          </div>
          {signOut}
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur-md lg:hidden">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/" aria-label="Femur home">
              <Logo />
            </Link>
            {signOut}
          </div>
          <div className="px-4 pb-3">
            <MobileSectionNav items={nav} />
          </div>
        </header>
        <div className={cn("mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8", wide ? "max-w-[100rem]" : "max-w-6xl")}>
          <DemoNotice className="mb-6">
            Running on sample data (no backend connected). Changes are kept in this browser tab only and reset on reload.
          </DemoNotice>
          {headerAction}
          {children}
        </div>
      </div>
    </div>
  );
}

export function PageTitle({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[1.75rem] leading-tight font-medium text-teal-deep sm:text-[2rem]">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
