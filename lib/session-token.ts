import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import type { SessionUser } from "@/types/auth";

// A session is a signed token holding the user, so any server instance can check it without a
// shared session store (on Vercel, pages and API routes may run in separate processes).
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

interface SessionPayload extends SessionUser {
  readonly exp: number;
}

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET was not set at build time (see next.config.ts).");
  return value;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export function createSessionToken(user: SessionUser): string {
  const payload: SessionPayload = {
    id: user.id,
    email: user.email,
    exp: Date.now() + SESSION_TTL_MS,
  };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function readSessionToken(token: string): SessionUser | null {
  const [data, signature, extra] = token.split(".");
  if (!data || !signature || extra !== undefined) return null;
  const expected = Buffer.from(sign(data));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString("utf8")) as SessionPayload;
    if (typeof payload.id !== "string" || typeof payload.email !== "string") return null;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return { id: payload.id, email: payload.email };
  } catch {
    return null;
  }
}
