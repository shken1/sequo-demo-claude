"use client";

interface ErrorPageProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-4 py-8 sm:px-8">
      <div className="surface-card flex flex-col items-center gap-8 border-l-4 border-l-accent px-4 py-12 text-center sm:px-8 sm:py-16">
        <div className="flex flex-col items-center gap-4">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-12 text-accent drop-shadow-[0_0_8px_var(--color-accent)]"
            fill="currentColor"
            fillRule="evenodd"
            shapeRendering="crispEdges"
          >
            <path d="M10 2h4v2h2v4h2v4h2v4h2v6H2v-6h2v-4h2V8h2V4h2zm1 6v7h2V8zm0 9v2h2v-2z" />
          </svg>
          <p role="alert" className="font-mono text-2xl text-text sm:text-3xl">
            The shared streak could not be loaded.
          </p>
        </div>
        <button type="button" onClick={reset} className="btn-primary w-full sm:w-auto">
          Try again
        </button>
      </div>
    </main>
  );
}
