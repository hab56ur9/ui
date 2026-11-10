import type { ReactNode } from "react";
import { Icon } from "./Icon";

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

export function Figure({ caption, kind = "figure", height, children }: { caption: ReactNode; kind?: "figure" | "table"; height?: number; children: ReactNode }) {
  return (
    <figure className={`figure is-${kind}`}>
      {kind === "table" && <figcaption>{caption}</figcaption>}
      <div className="figure-body" style={height ? { height } : undefined}>
        {children}
      </div>
      {kind === "figure" && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
