import { Button } from "ui";
import { Row, useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Row>
      <Button variant="primary" icon="plus">
        {t({ ko: "위젯 추가", en: "Add widget" })}
      </Button>
      <Button icon="download">{t({ ko: "내려받기", en: "Download" })}</Button>
      <Button variant="danger" icon="trash">
        {t({ ko: "삭제", en: "Delete" })}
      </Button>
    </Row>
  );
}
