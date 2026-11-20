import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Femur Physiotherapy & Wellness Center",
    template: "%s · Femur",
  },
  description:
    "Personalised physiotherapy, rehabilitation and wellness consultancy in Uttara, Dhaka. Book an appointment online in minutes.",
  alternates: { canonical: "/" },
  keywords: ["physiotherapy Uttara", "physiotherapist Dhaka", "pain management", "rehabilitation", "sports injury", "pregnancy physiotherapy"],
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
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh">
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
