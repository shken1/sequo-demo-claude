interface StreakLengthProps {
  readonly streakLength: number;
}

export function StreakLength({ streakLength }: StreakLengthProps) {
  return (
    <p className="text-center">
      <span className="font-body text-8xl leading-none text-primary" data-testid="streak-length">
        {streakLength}
      </span>{" "}
      <span>{streakLength === 1 ? "day" : "days"}</span>
    </p>
  );
}
