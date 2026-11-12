/**
 * Validated, typed access to public environment variables.
 * Only NEXT_PUBLIC_* values may be read here — this module is imported by client code.
 */
export type ApiMode = "mock" | "live";

const rawMode = process.env.NEXT_PUBLIC_API_MODE ?? "mock";

export const env = {
  apiMode: (rawMode === "live" ? "live" : "mock") as ApiMode,
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/$/, ""),
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  niraUrl: process.env.NEXT_PUBLIC_NIRA_URL ?? "https://nira.femurphysio.com",
} as const;

export const isMockMode = env.apiMode === "mock";
