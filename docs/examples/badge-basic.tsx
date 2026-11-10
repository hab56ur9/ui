import { Badge, type BadgeTone } from "ui";
import { Row, useT } from "../demo";

const TONES: BadgeTone[] = ["neutral", "main", "good", "warning", "critical"];

export default function Example() {
  const t = useT();
  const names: Record<BadgeTone, string> = {
    neutral: t({ ko: "기본", en: "Neutral" }),
    main: t({ ko: "강조", en: "Main" }),
    good: t({ ko: "정상", en: "Good" }),
    warning: t({ ko: "주의", en: "Warning" }),
    critical: t({ ko: "오류", en: "Critical" }),
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
