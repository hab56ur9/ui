import { Button } from "ui";
import { Row, useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Row>
      <Button>{t({ ko: "보조", en: "Secondary" })}</Button>
      <Button variant="primary">{t({ ko: "주요", en: "Primary" })}</Button>
      <Button variant="danger">{t({ ko: "위험", en: "Danger" })}</Button>
      <Button disabled>{t({ ko: "비활성", en: "Disabled" })}</Button>
    </Row>
  );
}
