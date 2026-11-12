import { Lock, X } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/media/logo";
import { routes } from "@/config/site";

/** Focused chrome for the booking flow — no distracting navigation. */
export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href={routes.home} aria-label="Femur home">
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden items-center gap-1.5 text-xs text-ink-soft sm:inline-flex">
              <Lock className="size-3.5" /> Your details are kept private
            </span>
            <Link href={routes.home} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-mist hover:text-ink">
              <X className="size-4" /> Exit
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
