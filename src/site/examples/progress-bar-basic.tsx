import { ProgressBar, Row } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("progress-bar-basic");
  return (
    <div style={{ display: "grid", gap: "var(--space-4)", width: "100%", maxWidth: 360 }}>
      <ProgressBar label={text.project} value={7} max={18} />
      <Row>
        <ProgressBar label={text.checks} value={3} max={5} length="short" />
        {text.count}
      </Row>
    </div>
  );
}
