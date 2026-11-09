import type { ReactNode } from "react";
import { Icon } from "../Icon";

export function Takeaway({ children }: { children: ReactNode }) {
  return <p className="takeaway">{children}</p>;
}

export type BulletItem = string | { text: string; items?: string[] };

export function Bullets({ items }: { items: BulletItem[] }) {
  return (
    <ul className="bullets">
      {items.map((item) => {
        const { text, items: children } = typeof item === "string" ? { text: item, items: undefined } : item;
        return (
          <li key={text}>
            {text}
            {children && (
              <ul>
                {children.map((child) => (
                  <li key={child}>{child}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export type Step = { title: string; body?: string };

export function Steps({ items }: { items: Step[] }) {
  return (
    <ol className="steps">
      {items.map((step, i) => (
        <li key={step.title}>
          <span className="steps-number">{i + 1}</span>
          <strong>{step.title}</strong>
          {step.body && <p>{step.body}</p>}
          {i < items.length - 1 && (
            <span className="steps-arrow" aria-hidden="true">
              <Icon name="chevron-right" />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

const CALLOUT_ICON = { info: "info", warning: "warning", good: "success" };

export function Callout({ tone = "info", title, children }: { tone?: "info" | "warning" | "good"; title?: string; children: ReactNode }) {
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
