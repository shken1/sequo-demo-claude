interface StreakLengthProps {
  readonly streakLength: number;
}

export function StreakLength({ streakLength }: StreakLengthProps) {
  return (
    <p className="flex flex-col items-center gap-4 text-center">
      <span
        className="glow-primary-strong font-heading text-7xl leading-none tracking-[0.12em] text-primary tabular-nums sm:text-[8rem]"
        data-testid="streak-length"
      >
        {streakLength}
      </span>{" "}
      <span className="font-body text-2xl tracking-[0.3em] text-muted sm:text-3xl">
        {streakLength === 1 ? "day" : "days"}
      </span>
    </p>
  );
}
