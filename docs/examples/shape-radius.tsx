import type { CSSProperties } from "react";

const RADII = ["control", "card", "sheet", "pill"];
const ELEVATIONS = ["card", "lifted", "overlay"];

export default function Example() {
  return (
    <div className="docs-shapes">
      {RADII.map((name) => (
        <div className="docs-shape" key={`radius-${name}`}>
          <i style={{ "--r": `var(--radius-${name})` } as CSSProperties} />
          <span>{`radius.${name}`}</span>
        </div>
      ))}
      {ELEVATIONS.map((name) => (
        <div className="docs-shape" key={`elevation-${name}`}>
          <i style={{ "--e": `var(--elevation-${name})` } as CSSProperties} />
          <span>{`elevation.${name}`}</span>
        </div>
      ))}
    </div>
  );
}
