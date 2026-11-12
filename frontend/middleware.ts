import { NextResponse, type NextRequest } from "next/server";
import { DEMO_SESSION_COOKIE, SESSION_COOKIE } from "@/config/site";
import { decodeDemoSession } from "@/lib/demo-session";

/**
 * Edge gate for portals. Only checks that a session cookie EXISTS and redirects to /login otherwise.
 * Role/permission decisions are made by the backend (and re-checked in portal layouts) — never here alone.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const live = req.cookies.get(SESSION_COOKIE)?.value;
  const demo = decodeDemoSession(req.cookies.get(DEMO_SESSION_COOKIE)?.value);

  if (!live && !demo) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
