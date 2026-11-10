import { Icon } from "ui";
import { Row, useText } from "../demo";

export default function Example() {
  const text = useText("icons-size");
  return (
    <Row>
      <Icon name="chart-line" size="sm" />
      <Icon name="chart-line" size="md" />
      <Icon name="chart-line" size="lg" />
      <span style={{ color: "var(--color-main-default)" }}>
        <Icon name="success" size="lg" label={text.done} />
      </span>
    </Row>
  );
}
