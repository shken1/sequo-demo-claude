import { NextResponse } from "next/server";

import { readCredentials, setSessionCookie } from "@/lib/auth";
import { createPasswordUser } from "@/lib/auth-store";
import type { AuthResponse } from "@/types/auth";

export async function POST(request: Request): Promise<NextResponse<AuthResponse>> {
  const credentials = await readCredentials(request, true);
  if (typeof credentials === "string") {
    return NextResponse.json({ ok: false, message: credentials }, { status: 400 });
  }
  const user = createPasswordUser(credentials.email, credentials.password);
  if (!user) {
    return NextResponse.json(
      { ok: false, message: "An account with that email already exists. Sign in instead." },
      { status: 409 },
    );
  }
  const response = NextResponse.json<AuthResponse>({ ok: true, message: null });
  setSessionCookie(response, user);
  return response;
}
