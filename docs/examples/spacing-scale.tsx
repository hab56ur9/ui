import type { CSSProperties } from "react";

const STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 24];

export default function Example() {
  return (
    <>
      {STEPS.map((step) => (
        <div className="docs-bar" key={step}>
          <span>{`space.${step} · ${step * 4}px`}</span>
          <i style={{ "--size": `var(--space-${step})` } as CSSProperties} />
        </div>
      ))}
    </>
  );
}
