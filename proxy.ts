import { NextResponse, type NextRequest } from "next/server";

// Every page and API route except sign-in requires a session cookie. Pages still check the session
// itself on the server (lib/auth.ts), so a stale cookie cannot get past them.
export function proxy(request: NextRequest) {
  if (request.cookies.has("session")) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/signin", request.url));
}

export const config = {
  matcher: ["/((?!signin|api/auth/|_next/|favicon.ico).*)"],
};
