import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PlaceholderMark } from "@/components/ui/placeholder";
import type { SiteSettings } from "@/types/cms";

export function ContactDetails({ settings }: { settings: SiteSettings }) {
  const { contact, openingHours, placeholders } = settings;
  const ph = (k: string) => placeholders.includes(k) && <PlaceholderMark className="ml-2" />;
  const wa = contact.whatsapp.replace(/\D/g, "");
  const rows = [
    { Icon: MapPin, label: "Address", value: <>{contact.addressLines.map((l) => <span key={l} className="block">{l}</span>)}{ph("contact.addressLines")}</> },
    { Icon: Phone, label: "Phone", value: <><a className="hover:text-teal" href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}>{contact.phone}</a>{ph("contact.phone")}</> },
    { Icon: MessageCircle, label: "WhatsApp", value: <><a className="hover:text-teal" href={`https://wa.me/${wa}`} rel="noopener" target="_blank">{contact.whatsapp}</a>{ph("contact.whatsapp")}</> },
    { Icon: Mail, label: "Email", value: <><a className="hover:text-teal" href={`mailto:${contact.email}`}>{contact.email}</a>{ph("contact.email")}</> },
  ];
  return (
    <div className="space-y-6">
      <ul className="space-y-5">
        {rows.map(({ Icon, label, value }) => (
          <li key={label} className="flex gap-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-mist text-teal">
              <Icon className="size-[1.1rem]" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">{label}</p>
              <div className="mt-0.5 text-ink">{value}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="rounded-xl border border-line bg-white p-4">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide text-ink-soft uppercase">
          <Clock className="size-4 text-sage" /> Opening hours {ph("openingHours")}
        </p>
        <dl className="space-y-1.5 text-sm">
          {openingHours.map((r) => (
            <div key={r.label} className="flex justify-between gap-4">
              <dt className="text-ink">{r.label}</dt>
              <dd className="text-right text-ink-soft">{r.hours}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/** Keyless Google Maps embed, lazy-loaded so it never affects LCP. */
export function MapEmbed({ query, className }: { query: string; className?: string }) {
  return (
    <iframe
      title="Map showing Femur's location in Uttara, Dhaka"
      src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className ?? "h-full min-h-80 w-full rounded-[var(--radius-card)] border border-line bg-mist"}
    />
  );
}
