interface StreakLengthProps {
  readonly streakLength: number;
}

export function StreakLength({ streakLength }: StreakLengthProps) {
  return (
    <p className="flex flex-col items-center gap-3 text-center">
      <span
        className="glow-primary-strong font-mono text-[8rem] leading-[0.8] text-primary tabular-nums sm:text-[12rem]"
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
