import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { api } from "@/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await api.catalog.listServices();
  const staticPaths = ["", "/services", "/specialists", "/pricing", "/membership", "/about", "/our-story", "/faq", "/contact", "/nira"];
  const now = new Date();
  return [
    ...staticPaths.map((p) => ({ url: `${env.siteUrl}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${env.siteUrl}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
