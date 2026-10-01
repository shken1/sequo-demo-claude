import { requireUser } from "@/lib/auth";
import { fetchStreak } from "@/lib/streak-api";

import { SignOutButton } from "./SignOutButton";
import { StreakLength } from "./StreakLength";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requireUser();
  const streak = await fetchStreak();

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-12">
      <header className="surface-card flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="min-w-0 text-muted">
          Signed in as{" "}
          <span data-testid="current-user" className="font-mono break-all text-text">
            {user.email}
          </span>
        </p>
        <SignOutButton />
      </header>
      <section className="surface-card my-auto flex flex-col items-center gap-8 px-4 py-10 sm:px-8 sm:py-14">
        <h1 className="glow-primary text-center font-heading text-base leading-relaxed tracking-[0.2em] text-text uppercase sm:text-2xl">
          Shared Streak
        </h1>
        <StreakLength streakLength={streak.streakLength} />
      </section>
    </main>
  );
}
