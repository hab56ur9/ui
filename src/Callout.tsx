import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { useI18n } from "./i18n";

const CALLOUT_ICON = { info: "info", warning: "warning", good: "success", do: "check", dont: "close" };

export type CalloutProps = { tone?: "info" | "warning" | "good" | "do" | "dont"; accent?: "left" | "top"; title?: string; children: ReactNode };

export function Callout({ tone = "info", accent = "left", title, children }: CalloutProps) {
  const { text } = useI18n();
  const heading = title ?? (tone === "do" ? text("guide.do") : tone === "dont" ? text("guide.dont") : undefined);
  if (accent === "top") {
    return (
      <aside className={`callout is-${tone} is-top`}>
        <div className="callout-head">
          <Icon name={CALLOUT_ICON[tone]} size="sm" />
          {heading && <strong className="callout-title">{heading}</strong>}
        </div>
        <div className="callout-body">{children}</div>
      </aside>
    );
  }
  return (
    <aside className={`callout is-${tone}`}>
      <Icon name={CALLOUT_ICON[tone]} />
      <div>
        {heading && <strong className="callout-title">{heading}</strong>}
        <div className="callout-body">{children}</div>
      </div>
    </aside>
  );
}
