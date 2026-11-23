import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { articles } from "@/content/articles";
import { conditions } from "@/content/conditions";
import { treatments } from "@/content/treatments";
import { api } from "@/services";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await api.catalog.listServices();
  const staticPaths = ["", "/services", "/specialists", "/pricing", "/membership", "/about", "/our-story", "/faq", "/contact", "/nira", "/maternal-care", "/conditions", "/treatments", "/blog", "/home-physiotherapy"];
  const now = new Date();
  return [
    ...staticPaths.map((p) => ({ url: `${env.siteUrl}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })),
    ...conditions.map((c) => ({ url: `${env.siteUrl}/conditions/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...treatments.map((t) => ({ url: `${env.siteUrl}/treatments/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...articles.map((a) => ({ url: `${env.siteUrl}/blog/${a.slug}`, lastModified: new Date(a.publishedOn), changeFrequency: "yearly" as const, priority: 0.6 })),
    ...services.map((s) => ({ url: `${env.siteUrl}/services/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
