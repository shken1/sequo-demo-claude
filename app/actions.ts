"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth";
import { logToday } from "@/lib/streak-store";
import type { LogTodayResponse } from "@/types/log";

/**
 * Logs today on the shared streak for the signed-in partner. A Server Action, so it runs in the
 * same server process as the page that reads the streak (decisions #15).
 */
export async function logTodayAction(): Promise<LogTodayResponse | { error: string }> {
  if (!(await getCurrentUser())) return { error: "Sign in first." };
  const { outcome, streak } = logToday();
  revalidatePath("/");
  return { outcome, streakLength: streak.streakLength };
}
