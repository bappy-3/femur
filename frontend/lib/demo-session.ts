import type { Role } from "@/types/user";

/**
 * MOCK MODE ONLY — a readable demo-session cookie so portals can be previewed without a backend.
 * In live mode the backend sets an opaque httpOnly `femur_sid` cookie and this is never used.
 */
export interface DemoSession {
  id: string;
  fullName: string;
  roles: Role[];
}

export function encodeDemoSession(s: DemoSession): string {
  return encodeURIComponent(JSON.stringify(s));
}

export function decodeDemoSession(raw: string | undefined | null): DemoSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (parsed && typeof parsed.id === "string" && Array.isArray(parsed.roles)) return parsed as DemoSession;
  } catch {
    /* malformed cookie */
  }
  return null;
}
