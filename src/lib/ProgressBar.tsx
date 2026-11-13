import type { CSSProperties } from "react";
import { percentOf } from "./format";

export type ProgressBarProps = {
  label: string;
  value: number;
  max?: number;
  length?: "fill" | "short";
};

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
      style={{ "--progress": percentOf(value, max) } as CSSProperties}
    >
      <span className="progress-bar-fill" />
    </span>
  );
}
