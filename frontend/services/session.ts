import "server-only";
import { cookies } from "next/headers";
import { isMockMode } from "@/config/env";
import { DEMO_SESSION_COOKIE, SESSION_COOKIE } from "@/config/site";
import { decodeDemoSession } from "@/lib/demo-session";
import { STAFF_ROLES, type SessionUser } from "@/types/user";
import { request } from "./http/client";
import { sessionUserFrom } from "./mock/auth";

/**
 * Server-side session lookup for layouts/pages.
 * Live: forwards the httpOnly cookie to GET /auth/me (backend is the authority).
 * Mock: reads the demo cookie.
 */
export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  if (isMockMode) {
    const demo = decodeDemoSession(jar.get(DEMO_SESSION_COOKIE)?.value);
    return demo ? sessionUserFrom(demo) : null;
  }
  const sid = jar.get(SESSION_COOKIE)?.value;
  if (!sid) return null;
  try {
    return await request<SessionUser>("/auth/me", { cache: "no-store", cookieHeader: jar.toString() });
  } catch {
    return null;
  }
}

export function isStaff(user: SessionUser | null): boolean {
  return !!user?.roles.some((r) => STAFF_ROLES.includes(r));
}
