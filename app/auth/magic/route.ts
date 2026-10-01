import { NextResponse, type NextRequest } from "next/server";

import { setSessionCookie } from "@/lib/auth";
import { redeemMagicLink } from "@/lib/auth-store";

export function GET(request: NextRequest): NextResponse {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const user = /^[0-9a-f]{64}$/.test(token) ? redeemMagicLink(token) : null;
  if (!user) return NextResponse.redirect(new URL("/signin?link=invalid", request.url));
  const response = NextResponse.redirect(new URL("/", request.url));
  setSessionCookie(response, user);
  return response;
}
