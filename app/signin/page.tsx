import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import { AuthForm } from "./AuthForm";

export const dynamic = "force-dynamic";

export default async function SignInPage({ searchParams }: PageProps<"/signin">) {
  if (await getCurrentUser()) redirect("/");
  const { link } = await searchParams;

  return (
    <main>
      <h1>Shared Streak</h1>
      {link === "invalid" ? (
        <p role="alert">That sign-in link is invalid or has expired. Request a new one.</p>
      ) : null}
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
      <AuthForm
        title="Use magic link"
        idPrefix="magic"
        endpoint="/api/auth/magic-link"
        submitLabel="Send magic link"
        pendingLabel="Sending…"
        withPassword={false}
        redirectTo={null}
      />
    </main>
  );
}
