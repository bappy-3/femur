import { MessageCircle, Phone } from "lucide-react";
import type { SiteSettings } from "@/types/cms";

/** Digits-only international number for wa.me links, e.g. "+880 1712-345678" -> "8801712345678". */
export const waNumber = (raw: string) => raw.replace(/\D/g, "");

/**
 * Floating WhatsApp + call buttons. Sits bottom-right; on small screens it keeps clear of the iOS home bar
 * via safe-area padding, and stays out of the way of the booking flow's sticky footer.
 */
export function QuickContact({ contact }: { contact: SiteSettings["contact"] }) {
  const wa = `https://wa.me/${waNumber(contact.whatsapp)}?text=${encodeURIComponent("Hello Femur, I would like to book a physiotherapy appointment.")}`;
  return (
    <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 flex flex-col items-end gap-2.5 sm:right-6 sm:bottom-6">
      <a
        href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
        aria-label="Call the clinic"
        className="grid size-11 place-items-center rounded-full border border-line bg-white text-teal shadow-lift transition-transform hover:scale-105 sm:hidden"
      >
        <Phone className="size-5" />
      </a>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group flex h-12 items-center gap-2 rounded-full bg-[#1FA855] pr-4 pl-3.5 text-sm font-semibold text-white shadow-lift transition-transform hover:scale-[1.03] sm:h-13"
      >
        <MessageCircle className="size-5" /> <span className="max-sm:sr-only">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
