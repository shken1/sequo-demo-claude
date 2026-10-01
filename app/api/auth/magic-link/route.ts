import { NextResponse } from "next/server";

import { readCredentials } from "@/lib/auth";
import { createMagicLink } from "@/lib/auth-store";
import type { AuthResponse } from "@/types/auth";

export async function POST(request: Request): Promise<NextResponse<AuthResponse>> {
  const credentials = await readCredentials(request, false);
  if (typeof credentials === "string") {
    return NextResponse.json({ ok: false, message: credentials }, { status: 400 });
  }
  const link = new URL(`/auth/magic?token=${createMagicLink(credentials.email)}`, request.url);
  // No mail server in this build: the link is delivered to the server console (decisions.md #10).
  console.log(`[magic link] ${credentials.email}: ${link.toString()}`);
  return NextResponse.json({
    ok: true,
    message: `Check your email: we sent a sign-in link to ${credentials.email}.`,
  });
}
