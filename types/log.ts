/** JSON body `POST /api/streak/log` answers with. */
export interface LogTodayResponse {
  readonly outcome: "logged" | "already-logged";
  readonly streakLength: number;
}
