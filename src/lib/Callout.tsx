import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { useI18n } from "./i18n";
import { useEnter } from "./MotionScope";

const CALLOUT_ICON = { info: "info", warning: "warning", critical: "error", good: "success", do: "check", dont: "close" };

export type CalloutProps = { tone?: "info" | "warning" | "critical" | "good" | "do" | "dont"; accent?: "left" | "top"; title?: string; children: ReactNode };

export function Callout({ tone = "info", accent = "left", title, children }: CalloutProps) {
  const { text } = useI18n();
  const { enter } = useEnter();
  const heading = title ?? (tone === "do" ? text("guide.do") : tone === "dont" ? text("guide.dont") : undefined);
  if (accent === "top") {
    return (
      <aside className={`callout is-${tone} is-top`} data-motion={enter}>
        <div className="callout-head">
          <Icon name={CALLOUT_ICON[tone]} size="sm" />
          {heading && <strong className="callout-title">{heading}</strong>}
        </div>
        <div className="callout-body">{children}</div>
      </aside>
    );
  }
  return (
    <aside className={`callout is-${tone}`} data-motion={enter}>
      <Icon name={CALLOUT_ICON[tone]} />
      <div>
        {heading && <strong className="callout-title">{heading}</strong>}
        <div className="callout-body">{children}</div>
      </div>
    </aside>
  );
}
