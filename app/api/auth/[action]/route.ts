import { NextResponse, type NextRequest } from "next/server";

import { clearSession, readCredentials, setSessionCookie } from "@/lib/auth";
import {
  checkPassword,
  createMagicLink,
  createPasswordUser,
  redeemMagicLink,
} from "@/lib/auth-store";
import type { AuthResponse } from "@/types/auth";

// Every auth action lives in this one route so the in-memory account and magic-link store is a
// single store: on serverless hosting each route can run in its own process (decisions #14).
interface Context {
  readonly params: Promise<{ action: string }>;
}

function fail(message: string, status: number): NextResponse<AuthResponse> {
  return NextResponse.json({ ok: false, message }, { status });
}

async function signUp(request: Request): Promise<NextResponse<AuthResponse>> {
  const credentials = await readCredentials(request, true);
  if (typeof credentials === "string") return fail(credentials, 400);
  const user = createPasswordUser(credentials.email, credentials.password);
  if (!user) return fail("An account with that email already exists. Sign in instead.", 409);
  const response = NextResponse.json<AuthResponse>({ ok: true, message: null });
  setSessionCookie(response, user);
  return response;
}

async function signIn(request: Request): Promise<NextResponse<AuthResponse>> {
  const credentials = await readCredentials(request, true);
  if (typeof credentials === "string") return fail(credentials, 400);
  const user = checkPassword(credentials.email, credentials.password);
  if (!user) return fail("Wrong email or password.", 401);
  const response = NextResponse.json<AuthResponse>({ ok: true, message: null });
  setSessionCookie(response, user);
  return response;
}

async function sendMagicLink(request: Request): Promise<NextResponse<AuthResponse>> {
  const credentials = await readCredentials(request, false);
  if (typeof credentials === "string") return fail(credentials, 400);
  const link = new URL(`/api/auth/magic?token=${createMagicLink(credentials.email)}`, request.url);
  // No mail server in this build: the link is delivered to the server console (decisions.md #10).
  console.log(`[magic link] ${credentials.email}: ${link.toString()}`);
  return NextResponse.json({
    ok: true,
    message: `Check your email: we sent a sign-in link to ${credentials.email}.`,
  });
}

function signOut(): NextResponse<AuthResponse> {
  const response = NextResponse.json<AuthResponse>({ ok: true, message: null });
  clearSession(response);
  return response;
}

export async function POST(request: Request, context: Context): Promise<NextResponse> {
  const { action } = await context.params;
  switch (action) {
    case "sign-up":
      return signUp(request);
    case "sign-in":
      return signIn(request);
    case "magic-link":
      return sendMagicLink(request);
    case "sign-out":
      return signOut();
    default:
      return fail("Unknown action.", 404);
  }
}

/** `GET /api/auth/magic?token=…` redeems a magic link and lands on the tracker. */
export async function GET(request: NextRequest, context: Context): Promise<NextResponse> {
  const { action } = await context.params;
  if (action !== "magic") return fail("Unknown action.", 404);
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const user = /^[0-9a-f]{64}$/.test(token) ? redeemMagicLink(token) : null;
  if (!user) return NextResponse.redirect(new URL("/signin?link=invalid", request.url));
  const response = NextResponse.redirect(new URL("/", request.url));
  setSessionCookie(response, user);
  return response;
}
