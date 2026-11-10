import type { ReactNode } from "react";

export type BadgeTone = "neutral" | "main" | "good" | "warning" | "critical";
export type BadgeProps = { children: ReactNode; tone?: BadgeTone; variant?: "soft" | "solid" | "outline" };

export function Badge({ children, tone = "neutral", variant = "soft" }: BadgeProps) {
  return <span className={`badge is-${tone} is-${variant}`}>{children}</span>;
}
