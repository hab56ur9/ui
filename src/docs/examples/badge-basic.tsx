import { Badge, type BadgeTone } from "ui";
import { Row, useText } from "../demo";

const TONES: BadgeTone[] = ["neutral", "main", "good", "warning", "critical"];

export default function Example() {
  const text = useText("badge-basic");
  const names: Record<BadgeTone, string> = {
    neutral: text.neutral,
    main: text.main,
    good: text.good,
    warning: text.warning,
    critical: text.critical,
  };
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      {(["soft", "outline", "solid"] as const).map((variant) => (
        <Row key={variant}>
          <code style={{ width: 64 }}>{variant}</code>
          {TONES.map((tone) => (
            <Badge key={tone} tone={tone} variant={variant}>
              {names[tone]}
            </Badge>
          ))}
          <Badge tone="critical" variant={variant}>
            12
          </Badge>
        </Row>
      ))}
    </div>
  );
}
