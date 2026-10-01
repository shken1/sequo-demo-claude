import "server-only";

import { randomUUID } from "node:crypto";

import type { StreakRecord } from "@/types/streak";

// In-memory stand-in for the `streaks` table (see docs/decisions.md #7, #9).
// Kept on globalThis so the single row survives dev-server module reloads.
const globalStore = globalThis as typeof globalThis & { __streakRow?: StreakRecord };

/** Today's calendar date on the server, as YYYY-MM-DD. */
export function todayIsoDate(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** The single shared row; the initial insert happens once, on first use. */
export function selectStreak(): StreakRecord {
  globalStore.__streakRow ??= {
    id: randomUUID(),
    streakLength: 0,
    lastLoggedDate: todayIsoDate(),
    createdAt: new Date().toISOString(),
  };
  return globalStore.__streakRow;
}

export function updateStreak(
  changes: Partial<Pick<StreakRecord, "streakLength" | "lastLoggedDate">>,
): StreakRecord {
  globalStore.__streakRow = { ...selectStreak(), ...changes };
  return globalStore.__streakRow;
}
