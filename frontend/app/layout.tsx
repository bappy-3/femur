import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree, Noto_Sans_Bengali } from "next/font/google";
import { env } from "@/config/env";
import { RevealObserver } from "@/components/media/reveal-observer";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/** Bangla secondary-language text (loaded only for the Bengali glyph range). */
const bangla = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bn",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Femur Physiotherapy & Wellness Center",
    template: "%s · Femur",
  },
  description:
    "Women's and maternal physiotherapy in Uttara, Dhaka: care before, during and after pregnancy with female physiotherapists. Book online in minutes.",
  alternates: { canonical: "/" },
  keywords: ["pregnancy physiotherapy Dhaka", "postnatal physiotherapy", "pelvic floor therapy", "prenatal back pain", "C-section recovery", "female physiotherapist Uttara", "physiotherapy Uttara"],
  openGraph: { type: "website", locale: "en_BD", siteName: "Femur Physiotherapy & Wellness Center", url: "/" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#1B7452",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${bangla.variable}`}>
      <body className="min-h-dvh">
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
