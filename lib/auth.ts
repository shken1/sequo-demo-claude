import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";

import type { SessionUser } from "@/types/auth";

import { createSessionToken, readSessionToken } from "./session-token";

export const SESSION_COOKIE = "session";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD_LENGTH = 8;

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? readSessionToken(token) : null;
}

/** Call at the top of every protected page: redirects to /signin without a session. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/signin");
  return user;
}

export function setSessionCookie(response: NextResponse, user: SessionUser): void {
  response.cookies.set(SESSION_COOKIE, createSessionToken(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearSession(response: NextResponse): void {
  response.cookies.delete(SESSION_COOKIE);
}

/** Reads and validates `{ email, password? }` from a JSON request body. */
export async function readCredentials(
  request: Request,
  withPassword: boolean,
): Promise<{ email: string; password: string } | string> {
  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null) return "Malformed request.";
  const { email, password } = body as { email?: unknown; password?: unknown };
  const normalized = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!EMAIL_PATTERN.test(normalized)) return "Enter a valid email address.";
  if (!withPassword) return { email: normalized, password: "" };
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return { email: normalized, password };
}
