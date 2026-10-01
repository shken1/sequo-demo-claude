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
      <h2 id={`${idPrefix}-title`}>{title}</h2>
      <form onSubmit={handleSubmit} aria-describedby={message ? messageId : undefined} noValidate>
        <div>
          <label htmlFor={`${idPrefix}-email`}>Email</label>
          <input id={`${idPrefix}-email`} name="email" type="email" autoComplete="email" required />
        </div>
        {withPassword ? (
          <div>
            <label htmlFor={`${idPrefix}-password`}>Password</label>
            <input
              id={`${idPrefix}-password`}
              name="password"
              type="password"
              autoComplete={passwordAutoComplete}
              minLength={8}
              required
            />
          </div>
        ) : null}
        {message ? (
          <p id={messageId} role={status === "error" ? "alert" : "status"}>
            {message}
          </p>
        ) : null}
        <button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? pendingLabel : submitLabel}
        </button>
      </form>
    </section>
  );
}
