"use client";

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main>
      <p role="alert">The shared streak could not be loaded.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
