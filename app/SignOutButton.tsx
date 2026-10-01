"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick(): Promise<void> {
    setPending(true);
    await fetch("/api/auth/sign-out", { method: "POST" }).catch(() => null);
    router.replace("/signin");
    router.refresh();
  }

  return (
    <button type="button" onClick={handleClick} disabled={pending} aria-busy={pending}>
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
