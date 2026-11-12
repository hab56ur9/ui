import { Count, useMotion } from "./MotionScope";
import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Sparkline } from "./charts/Sparkline";
import { Icon, type IconName } from "./Icon";
import type { Color, Point } from "./types";

export type ButtonVariant = "secondary" | "primary" | "danger";
export type ButtonProps = { variant?: ButtonVariant; icon?: IconName; label?: string; disabled?: boolean; type?: "button" | "submit"; onClick?: () => void; children?: ReactNode };

export function Button({ label, ...props }: ButtonProps) {
  return <ButtonBase {...props} {...(label && { "aria-label": label, title: label })} />;
}

export function ButtonBase({ variant = "secondary", icon, className, children, type = "button", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; icon?: IconName }) {
  const classes = ["button", variant === "secondary" ? "" : `is-${variant}`, className ?? ""].filter(Boolean).join(" ");
  return (
    <button type={type} className={classes} title={typeof children === "string" ? children : undefined} {...rest}>
      {icon && <Icon name={icon} size="sm" />}
      {children !== undefined && children !== null && <span className="button-label">{children}</span>}
    </button>
  );
}

export type StatProps = {
  label?: ReactNode;
  value: ReactNode;
  delta?: { change: number; goodWhenUp?: boolean; neutral?: boolean; label?: string };
  note?: string;
  trend?: Point[];
  color?: Color;
  size?: "md" | "sm";
};

export type DeltaProps = { change: number; goodWhenUp?: boolean; neutral?: boolean };

export function Delta({ change, goodWhenUp = true, neutral = false }: DeltaProps) {
  const rising = change >= 0;
  return (
    <strong className={`delta ${neutral ? "is-neutral" : rising === goodWhenUp ? "is-good" : "is-bad"}`}>
      <Icon name={rising ? "arrow-up" : "arrow-down"} size="sm" />
      {`${Math.abs(change * 100).toFixed(1)}%`}
    </strong>
  );
}

export function Stat({ label, value, delta, note, trend, color = 1, size = "md" }: StatProps) {
  const motion = useMotion();
  const counted = motion && (typeof value === "string" || typeof value === "number");
  return (
    <div className={`stat is-${size}`}>
      {label && (
        <div className="stat-label" title={typeof label === "string" ? label : undefined}>
          {label}
        </div>
      )}
      <div className="stat-value">{counted ? <Count value={String(value)} /> : value}</div>
      {delta && (
        <div className="stat-delta">
          <Delta change={delta.change} goodWhenUp={delta.goodWhenUp} neutral={delta.neutral} />
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

export type SegmentedOption<V extends string> = { value: V; label: ReactNode; title?: string; lang?: string };

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
          aria-label={option.title}
          title={option.title ?? (typeof option.label === "string" ? option.label : undefined)}
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
