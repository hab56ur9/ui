import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { useI18n } from "./i18n";

const CALLOUT_ICON = { info: "info", warning: "warning", good: "success", do: "check", dont: "close" };

export type CalloutProps = { tone?: "info" | "warning" | "good" | "do" | "dont"; title?: string; children: ReactNode };

export function Callout({ tone = "info", title, children }: CalloutProps) {
  const { text } = useI18n();
  const heading = title ?? (tone === "do" ? text("guide.do") : tone === "dont" ? text("guide.dont") : undefined);
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
