import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Sparkline } from "./charts/Sparkline";
import { Icon, type IconName } from "./Icon";
import type { Color, Point } from "./types";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "secondary" | "primary" | "danger"; icon?: IconName };

export function Button({ variant = "secondary", icon, className, children, type = "button", ...rest }: ButtonProps) {
  const classes = ["button", variant === "secondary" ? "" : `is-${variant}`, className ?? ""].filter(Boolean).join(" ");
  return (
    <button type={type} className={classes} {...rest}>
      {icon && <Icon name={icon} size="sm" />}
      {children}
    </button>
  );
}

export type StatProps = {
  label?: ReactNode;
  value: ReactNode;
  delta?: { change: number; goodWhenUp?: boolean; label?: string };
  note?: string;
  trend?: Point[];
  color?: Color;
  size?: "md" | "sm";
};

export type DeltaProps = { change: number; goodWhenUp?: boolean };

export function Delta({ change, goodWhenUp = true }: DeltaProps) {
  const rising = change >= 0;
  return (
    <strong className={`delta ${rising === goodWhenUp ? "is-good" : "is-bad"}`}>
      <Icon name={rising ? "arrow-up" : "arrow-down"} size="sm" />
      {`${Math.abs(change * 100).toFixed(1)}%`}
    </strong>
  );
}

export function Stat({ label, value, delta, note, trend, color = 1, size = "md" }: StatProps) {
  return (
    <div className={`stat is-${size}`}>
      {label && <div className="stat-label">{label}</div>}
      <div className="stat-value">{value}</div>
      {delta && (
        <div className="stat-delta">
          <Delta change={delta.change} goodWhenUp={delta.goodWhenUp} />
          {delta.label && <span>{delta.label}</span>}
        </div>
      )}
      {note && <div className="stat-note">{note}</div>}
      {trend && trend.length > 0 && (
        <div className="stat-trend">
          <Sparkline points={trend} color={color} />
        </div>
      )}
    </div>
  );
}

export type SegmentedOption<V extends string> = { value: V; label: ReactNode; lang?: string };

export type SegmentedProps<V extends string> = {
  options: SegmentedOption<V>[];
  value?: V;
  defaultValue?: V;
  label: string;
  onChange?: (value: V) => void;
};

export function Segmented<V extends string>({ options, value, defaultValue, label, onChange }: SegmentedProps<V>) {
  const [own, setOwn] = useState(defaultValue ?? options[0]?.value);
  const selected = value ?? own;
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          lang={option.lang}
          aria-pressed={option.value === selected}
          onClick={() => {
            if (option.value === selected) return;
            setOwn(option.value);
            onChange?.(option.value);
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
