export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col justify-center px-4 py-8 sm:px-8"
    >
      <div className="surface-card flex flex-col items-center gap-4 px-4 py-12 sm:px-8 sm:py-16">
        <span aria-hidden="true" className="flex gap-2">
          <span className="neon-pulse size-3 rounded-[var(--radius)] bg-primary" />
          <span className="neon-pulse size-3 rounded-[var(--radius)] bg-primary [animation-delay:200ms]" />
          <span className="neon-pulse size-3 rounded-[var(--radius)] bg-primary [animation-delay:400ms]" />
        </span>
        <p
          role="status"
          className="neon-pulse text-center font-mono text-3xl tracking-[0.2em] text-primary uppercase sm:text-4xl"
        >
          Loading the shared streak…
        </p>
      </div>
    </main>
  );
}
