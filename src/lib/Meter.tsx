import type { CSSProperties, ReactNode } from "react";
import { percentOf } from "./format";
import { useI18n } from "./i18n";
import { Icon } from "./Icon";
import { useMotion } from "./MotionScope";

export type MeterStatus = "good" | "warning" | "critical";
export type MeterProps = { label: ReactNode; value: number; max?: number; target?: number; format?: (value: number) => string; status?: MeterStatus; note?: ReactNode };

const ICONS = { good: "success", warning: "warning", critical: "error" } as const;

export function Meter({ label, value, max = 100, target, format = (v) => v.toLocaleString(), status, note }: MeterProps) {
  const { text } = useI18n();
  const motion = useMotion();
  return (
    <div className={`meter${status ? ` is-${status}` : ""}`} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={typeof label === "string" ? label : undefined}>
      <div className="meter-head">
        <span className="meter-label">{label}</span>
        <span className="meter-value">
          {format(value)}
          <span className="meter-max"> / {format(max)}</span>
        </span>
      </div>
      <div className="meter-track" style={{ "--meter": percentOf(value, max), "--meter-target": target === undefined ? undefined : percentOf(target, max) } as CSSProperties}>
        <span className="meter-fill" data-motion={motion ? "grow" : undefined} />
        {target !== undefined && <span className="meter-target" />}
      </div>
      {(status || note) && (
        <div className="meter-note">
          {status && (
            <span className="meter-status" data-motion={motion && status !== "good" ? "attention" : undefined}>
              <Icon name={ICONS[status]} size="sm" />
              {text(`meter.${status}`)}
            </span>
          )}
          {note}
        </div>
      )}
    </div>
  );
}
