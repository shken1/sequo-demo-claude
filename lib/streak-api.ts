import "server-only";

import { cookies, headers } from "next/headers";

import type { StreakRecord } from "@/types/streak";

/**
 * Reads the shared streak through the app's own API route (invariant 2: data reads go through
 * API routes), forwarding the visitor's cookies so the route sees the same session.
 */
export async function fetchStreak(): Promise<StreakRecord> {
  const host = (await headers()).get("host");
  if (!host) throw new Error("Missing host header.");
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const response = await fetch(`${protocol}://${host}/api/streak`, {
    headers: { cookie: (await cookies()).toString() },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Streak request failed with ${response.status}.`);
  return (await response.json()) as StreakRecord;
}
