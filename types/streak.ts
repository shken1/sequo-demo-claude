export interface StreakRecord {
  readonly id: string;
  readonly streakLength: number;
  /** ISO date (YYYY-MM-DD), or null. */
  readonly lastLoggedDate: string | null;
  readonly createdAt: string;
}
