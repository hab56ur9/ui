import type { ReactNode } from "react";
import { useMotion } from "./MotionScope";

export type BadgeTone = "neutral" | "main" | "good" | "warning" | "critical";
export type BadgeProps = { children: ReactNode; tone?: BadgeTone; variant?: "soft" | "solid" | "outline" };

const URGENT: BadgeTone[] = ["warning", "critical"];

export function Badge({ children, tone = "neutral", variant = "soft" }: BadgeProps) {
  const motion = useMotion();
  return (
    <span className={`badge is-${tone} is-${variant}`} data-motion={motion && URGENT.includes(tone) ? "attention" : undefined} title={typeof children === "string" ? children : undefined}>
      <span className="badge-text">{children}</span>
    </span>
  );
}
