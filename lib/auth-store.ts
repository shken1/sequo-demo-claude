import "server-only";

import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

import type { SessionUser } from "@/types/auth";

// In-memory stand-in for Supabase Auth (see docs/decisions.md #7, #10).
// Kept on globalThis so accounts and sessions survive dev-server module reloads.
interface StoredUser extends SessionUser {
  readonly salt: string | null;
  readonly passwordHash: string | null;
}

interface MagicLink {
  readonly email: string;
  readonly expiresAt: number;
}

interface AuthStore {
  readonly users: Map<string, StoredUser>;
  readonly sessions: Map<string, string>;
  readonly magicLinks: Map<string, MagicLink>;
}

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000;

const globalStore = globalThis as typeof globalThis & { __authStore?: AuthStore };

function store(): AuthStore {
  globalStore.__authStore ??= { users: new Map(), sessions: new Map(), magicLinks: new Map() };
  return globalStore.__authStore;
}

function hash(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

/** Returns null when the email already has a password account. */
export function createPasswordUser(email: string, password: string): SessionUser | null {
  const { users } = store();
  const existing = users.get(email);
  if (existing?.passwordHash) return null;
  const salt = randomBytes(16).toString("hex");
  const user: StoredUser = {
    id: existing?.id ?? randomUUID(),
    email,
    salt,
    passwordHash: hash(password, salt),
  };
  users.set(email, user);
  return { id: user.id, email };
}

export function checkPassword(email: string, password: string): SessionUser | null {
  const user = store().users.get(email);
  if (!user?.salt || !user.passwordHash) return null;
  const expected = Buffer.from(user.passwordHash, "hex");
  const actual = Buffer.from(hash(password, user.salt), "hex");
  return timingSafeEqual(expected, actual) ? { id: user.id, email } : null;
}

/** Magic link sign-in creates the account on first use, as Supabase's OTP sign-in does. */
export function createMagicLink(email: string): string {
  const token = randomBytes(32).toString("hex");
  store().magicLinks.set(token, { email, expiresAt: Date.now() + MAGIC_LINK_TTL_MS });
  return token;
}

/** One-time: the token is spent whether or not it was still valid. */
export function redeemMagicLink(token: string): SessionUser | null {
  const { magicLinks, users } = store();
  const link = magicLinks.get(token);
  magicLinks.delete(token);
  if (!link || link.expiresAt < Date.now()) return null;
  let user = users.get(link.email);
  if (!user) {
    user = { id: randomUUID(), email: link.email, salt: null, passwordHash: null };
    users.set(link.email, user);
  }
  return { id: user.id, email: user.email };
}

export function createSession(userId: string): string {
  const token = randomBytes(32).toString("hex");
  store().sessions.set(token, userId);
  return token;
}

export function sessionUser(token: string): SessionUser | null {
  const userId = store().sessions.get(token);
  if (!userId) return null;
  for (const user of store().users.values()) {
    if (user.id === userId) return { id: user.id, email: user.email };
  }
  return null;
}

export function deleteSession(token: string): void {
  store().sessions.delete(token);
}
