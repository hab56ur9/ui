import { Icon } from "ui";
import { Row, useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Row>
      <Icon name="chart-line" size="sm" />
      <Icon name="chart-line" size="md" />
      <Icon name="chart-line" size="lg" />
      <span style={{ color: "var(--color-main-default)" }}>
        <Icon name="success" size="lg" label={t({ ko: "완료", en: "Done" })} />
      </span>
    </Row>
  );
}
