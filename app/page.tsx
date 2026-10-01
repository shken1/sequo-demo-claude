import { requireUser } from "@/lib/auth";

import { SignOutButton } from "./SignOutButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await requireUser();

  return (
    <main>
      <header>
        <p>
          Signed in as <span data-testid="current-user">{user.email}</span>
        </p>
        <SignOutButton />
      </header>
      <h1>Shared Streak</h1>
    </main>
  );
}
