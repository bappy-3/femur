import { DEMO_SESSION_COOKIE } from "@/config/site";
import { decodeDemoSession, encodeDemoSession, type DemoSession } from "@/lib/demo-session";
import type { SessionUser } from "@/types/user";
import type { AuthApi } from "../contracts";
import { ApiError } from "../http/client";
import { db } from "./db";
import { demoAdminUser, demoPatientUser } from "./fixtures/people";
import { clone, latency } from "./shared";

function writeCookie(session: DemoSession | null) {
  if (typeof document === "undefined") return;
  document.cookie = session
    ? `${DEMO_SESSION_COOKIE}=${encodeDemoSession(session)}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`
    : `${DEMO_SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function readCookie(): DemoSession | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${DEMO_SESSION_COOKIE}=`))
    ?.slice(DEMO_SESSION_COOKIE.length + 1);
  return decodeDemoSession(raw);
}

export function sessionUserFrom(session: DemoSession): SessionUser {
  const isStaff = session.roles.some((r) => r !== "PATIENT");
  const store = db();
  return {
    id: session.id,
    fullName: isStaff ? session.fullName : store.account.profile.fullName,
    phone: isStaff ? demoAdminUser.phone : store.account.profile.phone,
    email: isStaff ? demoAdminUser.email : store.account.profile.email,
    roles: session.roles,
    membership: isStaff ? { status: "NONE", planId: null, planName: null, startsAt: null, endsAt: null, entitlements: {} } : clone(store.account.membership),
  };
}

/** Demo rule: identifiers containing "admin" sign in as ADMIN; anything else as PATIENT. Any password ≥ 6 chars. */
export const mockAuth: AuthApi = {
  login: async ({ identifier, password }) => {
    await latency(400);
    if (password.length < 6) throw new ApiError(401, "UNAUTHENTICATED", "Incorrect phone/email or password.");
    const isAdmin = identifier.toLowerCase().includes("admin");
    const session: DemoSession = isAdmin
      ? { id: demoAdminUser.id, fullName: demoAdminUser.fullName, roles: ["ADMIN"] }
      : { id: demoPatientUser.id, fullName: db().account.profile.fullName, roles: ["PATIENT"] };
    writeCookie(session);
    return sessionUserFrom(session);
  },
  register: async (input) => {
    await latency(500);
    const store = db();
    store.account.profile = { fullName: input.fullName, email: input.email, phone: input.phone };
    const self = store.account.savedPatients.find((p) => p.relationship === "SELF");
    if (self) Object.assign(self, { fullName: input.fullName, gender: input.gender, phone: input.phone, email: input.email });
    const session: DemoSession = { id: demoPatientUser.id, fullName: input.fullName, roles: ["PATIENT"] };
    writeCookie(session);
    return sessionUserFrom(session);
  },
  logout: async () => writeCookie(null),
  me: async () => {
    const s = readCookie();
    return s ? sessionUserFrom(s) : null;
  },
  requestPasswordReset: async () => {
    await latency(400);
  },
};
