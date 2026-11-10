import { Button } from "ui";
import { Row, useText } from "../demo";

export default function Example() {
  const text = useText("icons-button");
  return (
    <Row>
      <Button variant="primary" icon="plus">
        {text.addWidget}
      </Button>
      <Button icon="download">{text.download}</Button>
      <Button variant="danger" icon="trash">
        {text.delete}
      </Button>
    </Row>
  );
}
