import type { CSSProperties, ReactNode } from "react";
import { useI18n } from "./i18n";
import { Icon } from "./Icon";

export type MeterStatus = "good" | "warning" | "critical";
export type MeterProps = { label: ReactNode; value: number; max?: number; target?: number; format?: (value: number) => string; status?: MeterStatus; note?: ReactNode };

const ICONS = { good: "success", warning: "warning", critical: "error" } as const;
const share = (value: number, max: number) => `${Math.max(0, Math.min(100, (value / max) * 100))}%`;

export function Meter({ label, value, max = 100, target, format = (v) => v.toLocaleString(), status, note }: MeterProps) {
  const { text } = useI18n();
  return (
    <div className={`meter${status ? ` is-${status}` : ""}`} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} aria-label={typeof label === "string" ? label : undefined}>
      <div className="meter-head">
        <span className="meter-label">{label}</span>
        <span className="meter-value">
          {format(value)}
          <span className="meter-max"> / {format(max)}</span>
        </span>
      </div>
      <div className="meter-track" style={{ "--meter": share(value, max), "--meter-target": target === undefined ? undefined : share(target, max) } as CSSProperties}>
        <span className="meter-fill" />
        {target !== undefined && <span className="meter-target" />}
      </div>
      {(status || note) && (
        <div className="meter-note">
          {status && (
            <span className="meter-status">
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
