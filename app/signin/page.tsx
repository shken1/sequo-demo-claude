import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { AuthForm } from "./AuthForm";

export const dynamic = "force-dynamic";

export default async function SignInPage({ searchParams }: PageProps<"/signin">) {
  if (await getCurrentUser()) redirect("/");
  const { link } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-8 sm:px-8 sm:py-12">
      <div className="surface-card w-full max-w-3xl px-4 py-8 sm:px-8">
        <h1 className="glow-primary text-center font-heading text-lg leading-relaxed tracking-[0.18em] text-primary sm:text-2xl">
          Shared Streak
        </h1>
        {link === "invalid" ? (
          <p
            role="alert"
            className="glow-accent mt-6 rounded-(--radius) border border-accent bg-background/60 px-3 py-2 text-accent"
          >
            That sign-in link is invalid or has expired. Request a new one.
          </p>
        ) : null}
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <AuthForm
            title="Sign in"
            idPrefix="sign-in"
            endpoint="/api/auth/sign-in"
            submitLabel="Sign in"
            pendingLabel="Signing in…"
            withPassword
            passwordAutoComplete="current-password"
            redirectTo="/"
          />
          <AuthForm
            title="Sign up"
            idPrefix="sign-up"
            endpoint="/api/auth/sign-up"
            submitLabel="Sign up"
            pendingLabel="Signing up…"
            withPassword
            passwordAutoComplete="new-password"
            redirectTo="/"
          />
        </div>
        <div className="mt-8 border-t border-dashed border-border pt-8">
          <AuthForm
            title="Use magic link"
            idPrefix="magic"
            endpoint="/api/auth/magic-link"
            submitLabel="Send magic link"
            pendingLabel="Sending…"
            withPassword={false}
            redirectTo={null}
          />
        </div>
      </div>
    </main>
  );
}
