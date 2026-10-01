import { NextResponse } from "next/server";

import { selectStreak, updateStreak } from "@/lib/streak-store";
import type { StreakRecord } from "@/types/streak";

export const dynamic = "force-dynamic";

export function GET(): NextResponse<StreakRecord> {
  return NextResponse.json(selectStreak());
}

/**
 * Development-only stand-in for editing the row in the database dashboard (step 1 verification).
 * Body: { "streakLength": <non-negative integer> }.
 */
export async function PATCH(request: Request): Promise<NextResponse> {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }
  const body: unknown = await request.json().catch(() => null);
  const streakLength =
    typeof body === "object" && body !== null && "streakLength" in body
      ? (body as { streakLength: unknown }).streakLength
      : undefined;
  if (typeof streakLength !== "number" || !Number.isInteger(streakLength) || streakLength < 0) {
    return NextResponse.json(
      { error: "streakLength must be a non-negative integer." },
      { status: 400 },
    );
  }
  return NextResponse.json(updateStreak({ streakLength }));
}
