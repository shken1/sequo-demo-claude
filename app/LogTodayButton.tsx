"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { LogTodayResponse } from "@/types/log";

type Status = "idle" | "pending" | "logged" | "already-logged" | "error";

const MESSAGES: Record<Exclude<Status, "idle" | "pending">, string> = {
  logged: "Today is logged. The streak went up by one.",
  "already-logged": "Today is already logged.",
  error: "Could not log today. Try again.",
};

export function LogTodayButton() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick(): Promise<void> {
    setStatus("pending");
    try {
      const response = await fetch("/api/streak/log", { method: "POST" });
      if (!response.ok) throw new Error(`Log request failed with ${response.status}.`);
      const result = (await response.json()) as LogTodayResponse;
      setStatus(result.outcome);
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  const pending = status === "pending";

  const messageClass =
    status === "error"
      ? "glow-accent border-accent text-accent"
      : status === "logged"
        ? "glow-primary border-primary/60 text-primary"
        : "border-border text-muted";

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-busy={pending}
        className="btn-primary w-full px-8 py-1 font-body text-3xl tracking-[0.15em] normal-case sm:w-auto sm:min-w-72"
      >
        {pending ? "Logging…" : "Log Today"}
      </button>
      {status !== "idle" && status !== "pending" ? (
        <p
          role={status === "error" ? "alert" : "status"}
          data-testid="log-today-message"
          className={`w-full max-w-md rounded-(--radius) border bg-background/60 px-4 py-3 text-center text-2xl ${messageClass}`}
        >
          {MESSAGES[status]}
        </p>
      ) : null}
    </div>
  );
}
