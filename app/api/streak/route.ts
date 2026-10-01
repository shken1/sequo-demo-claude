import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { logToday, selectStreak, updateStreak } from "@/lib/streak-store";
import type { LogTodayResponse } from "@/types/log";
import type { StreakRecord } from "@/types/streak";

export const dynamic = "force-dynamic";

// Reading and logging live in this one route so they share the in-memory row: on serverless
// hosting each route can run in its own process (decisions #14).

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function GET(): NextResponse<StreakRecord> {
  return NextResponse.json(selectStreak());
}

/** Logs today on the shared streak for the signed-in partner. Takes no body. */
export async function POST(): Promise<NextResponse<LogTodayResponse | { error: string }>> {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const { outcome, streak } = logToday();
  return NextResponse.json({ outcome, streakLength: streak.streakLength });
}

/**
 * Development-only stand-in for editing the row in the database dashboard.
 * Body: { "streakLength"?: <non-negative integer>, "lastLoggedDate"?: "YYYY-MM-DD" | null }.
 */
export async function PATCH(request: Request): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }
  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }
  const changes: { streakLength?: number; lastLoggedDate?: string | null } = {};
  if ("streakLength" in body) {
    const { streakLength } = body as { streakLength: unknown };
    if (typeof streakLength !== "number" || !Number.isInteger(streakLength) || streakLength < 0) {
      return NextResponse.json(
        { error: "streakLength must be a non-negative integer." },
        { status: 400 },
      );
    }
    changes.streakLength = streakLength;
  }
  if ("lastLoggedDate" in body) {
    const { lastLoggedDate } = body as { lastLoggedDate: unknown };
    if (
      lastLoggedDate !== null &&
      (typeof lastLoggedDate !== "string" || !ISO_DATE.test(lastLoggedDate))
    ) {
      return NextResponse.json(
        { error: "lastLoggedDate must be YYYY-MM-DD or null." },
        { status: 400 },
      );
    }
    changes.lastLoggedDate = lastLoggedDate;
  }
  if (Object.keys(changes).length === 0) {
    return NextResponse.json({ error: "Nothing to change." }, { status: 400 });
  }
  return NextResponse.json(updateStreak(changes));
}
