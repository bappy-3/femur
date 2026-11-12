import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { env } from "@/config/env";
import { RevealObserver } from "@/components/media/reveal-observer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "Femur Physiotherapy & Wellness Center — Uttara, Dhaka",
    template: "%s · Femur Physiotherapy & Wellness",
  },
  description:
    "Personalised physiotherapy, rehabilitation and wellness consultancy in Uttara, Dhaka. Book an appointment online in minutes.",
  openGraph: { type: "website", locale: "en_BD", siteName: "Femur Physiotherapy & Wellness Center" },
};

export const viewport: Viewport = {
  themeColor: "#415F66",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-dvh">
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
