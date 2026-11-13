import type { CSSProperties } from "react";

export type ProgressBarProps = {
  label: string;
  value: number;
  max?: number;
  length?: "fill" | "short";
};

const measurable = (max: number) => max > 0;
const share = (value: number, max: number) => (measurable(max) ? `${Math.max(0, Math.min(100, (value / max) * 100))}%` : "0%");

export function ProgressBar({ label, value, max = 100, length = "fill" }: ProgressBarProps) {
  return (
    <span
      className={length === "short" ? "progress-bar is-short" : "progress-bar"}
      role="progressbar"
      aria-label={label}
      title={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      style={{ "--progress": share(value, max) } as CSSProperties}
    >
      <span className="progress-bar-fill" />
    </span>
  );
}
