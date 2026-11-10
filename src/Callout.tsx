import type { ReactNode } from "react";
import { Icon } from "./Icon";

const CALLOUT_ICON = { info: "info", warning: "warning", good: "success" };

export type CalloutProps = { tone?: "info" | "warning" | "good"; title?: string; children: ReactNode };

export function Callout({ tone = "info", title, children }: CalloutProps) {
  return (
    <aside className={`callout is-${tone}`}>
      <Icon name={CALLOUT_ICON[tone]} />
      <div>
        {title && <strong className="callout-title">{title}</strong>}
        <div className="callout-body">{children}</div>
      </div>
    </aside>
  );
}
