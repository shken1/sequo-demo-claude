"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import type { AuthResponse } from "@/types/auth";

interface AuthFormProps {
  readonly title: string;
  readonly idPrefix: string;
  readonly endpoint: string;
  readonly submitLabel: string;
  readonly pendingLabel: string;
  readonly withPassword: boolean;
  readonly passwordAutoComplete?: "new-password" | "current-password";
  /** Where to go after a successful request; null keeps the user here and shows the message. */
  readonly redirectTo: string | null;
}

type Status = "idle" | "pending" | "error" | "sent";

export function AuthForm({
  title,
  idPrefix,
  endpoint,
  submitLabel,
  pendingLabel,
  withPassword,
  passwordAutoComplete,
  redirectTo,
}: AuthFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("pending");
    setMessage(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      const result = (await response.json()) as AuthResponse;
      if (!result.ok) {
        setStatus("error");
        setMessage(result.message ?? "Something went wrong. Try again.");
        return;
      }
      if (redirectTo) {
        router.replace(redirectTo);
        router.refresh();
        return;
      }
      setStatus("sent");
      setMessage(result.message);
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Check your connection and try again.");
    }
  }

  const pending = status === "pending";
  const messageId = `${idPrefix}-message`;

  return (
    <section aria-labelledby={`${idPrefix}-title`}>
      <h2
        id={`${idPrefix}-title`}
        className="glow-accent flex items-center gap-2 font-heading text-xs leading-relaxed tracking-[0.2em] text-accent uppercase"
      >
        <span aria-hidden="true" className="inline-block size-2 bg-accent" />
        {title}
      </h2>
      <form
        onSubmit={handleSubmit}
        aria-describedby={message ? messageId : undefined}
        noValidate
        className="mt-4 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor={`${idPrefix}-email`} className="text-xl tracking-wide text-muted">
            Email
          </label>
          <input
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            className="field"
          />
        </div>
        {withPassword ? (
          <div className="flex flex-col gap-1">
            <label htmlFor={`${idPrefix}-password`} className="text-xl tracking-wide text-muted">
              Password
            </label>
            <input
              id={`${idPrefix}-password`}
              name="password"
              type="password"
              autoComplete={passwordAutoComplete}
              minLength={8}
              required
              className="field"
            />
          </div>
        ) : null}
        {message ? (
          <p
            id={messageId}
            role={status === "error" ? "alert" : "status"}
            className={
              status === "error"
                ? "glow-accent rounded-(--radius) border border-accent bg-background/60 px-3 py-2 text-accent"
                : "rounded-(--radius) border border-primary/60 bg-background/60 px-3 py-2 text-primary"
            }
          >
            {message}
          </p>
        ) : null}
        <button type="submit" disabled={pending} aria-busy={pending} className="btn-primary w-full">
          {pending ? pendingLabel : submitLabel}
        </button>
      </form>
    </section>
  );
}
