import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/media/logo";
import { PlaceholderMark } from "@/components/ui/placeholder";
import { footerNav, routes } from "@/config/site";
import type { SiteSettings } from "@/types/cms";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { contact, openingHours } = settings;
  const isPh = (key: string) => settings.placeholders.includes(key);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-teal-deep text-white/80">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="space-y-5">
          <Logo inverse />
          <p className="max-w-sm text-sm leading-relaxed text-white/65">{settings.tagline}. Physiotherapy-led care with visiting nutrition, general medicine, eye and dental consultants.</p>
          <ul className="space-y-2.5 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-mint" />
              <span>
                {contact.addressLines.join(", ")} {isPh("contact.addressLines") && <PlaceholderMark className="ml-1 border-white/30 bg-white/10 text-sand" />}
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="size-4 text-mint" /> <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a>
              {isPh("contact.phone") && <PlaceholderMark className="border-white/30 bg-white/10 text-sand" />}
            </li>
            <li className="flex items-center gap-2.5">
              <MessageCircle className="size-4 text-mint" /> WhatsApp {contact.whatsapp}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="size-4 text-mint" /> <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {Object.entries(footerNav).map(([group, links]) => (
            <div key={group}>
              <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">{group}</p>
              <ul className="space-y-2 text-sm">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">Hours</p>
            <ul className="space-y-2 text-sm">
              {openingHours.map((row) => (
                <li key={row.label}>
                  <span className="block text-white">{row.label}</span>
                  <span className="text-white/60">{row.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {settings.clinicName}. All rights reserved.</p>
          <p>
            Information on this website is general and does not replace professional medical advice.{" "}
            <Link href={routes.faq} className="underline-offset-4 hover:underline">
              FAQ
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
