import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import { logToday } from "@/lib/streak-store";
import type { LogTodayResponse } from "@/types/log";

export const dynamic = "force-dynamic";

/** Logs today on the shared streak for the signed-in partner. Takes no body. */
export async function POST(): Promise<NextResponse<LogTodayResponse | { error: string }>> {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const { outcome, streak } = logToday();
  return NextResponse.json({ outcome, streakLength: streak.streakLength });
}
