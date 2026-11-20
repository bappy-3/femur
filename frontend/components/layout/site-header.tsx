import { Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Logo } from "@/components/media/logo";
import { MainNav } from "@/components/navigation/main-nav";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { ButtonAnchor, ButtonLink } from "@/components/ui/button";
import { mainNav, routes } from "@/config/site";
import type { SiteSettings } from "@/types/cms";

/** Server component — static so public pages stay cacheable (no cookie reads here). */
export function SiteHeader({ announcement }: { announcement: SiteSettings["announcement"] }) {
  return (
    <>
      {announcement?.isPublished && <AnnouncementBar id={announcement.id} message={announcement.message} href={announcement.href} />}
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="container-page flex h-[4.25rem] items-center justify-between gap-6">
          <Link href={routes.home} aria-label="Femur — home" className="shrink-0">
            <Logo />
          </Link>
          <MainNav items={mainNav} />
          <div className="flex items-center gap-1.5">
            <ButtonAnchor href={routes.nira} variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Sparkles className="size-4 text-sand-deep" /> Ask Nira
            </ButtonAnchor>
            <Link href={routes.account.root} aria-label="My account" className="hidden size-9 place-items-center rounded-full text-teal hover:bg-mist sm:grid">
              <UserRound className="size-[1.15rem]" />
            </Link>
            <ButtonLink href={routes.booking} size="sm" className="hidden sm:inline-flex">
              Book Appointment
            </ButtonLink>
            <MobileNav items={mainNav} niraUrl={routes.nira} bookingHref={routes.booking} />
          </div>
        </div>
      </header>
    </>
  );
}
