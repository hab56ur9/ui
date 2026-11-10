import { Button } from "ui";
import { Row, useText } from "../demo";

export default function Example() {
  const text = useText("button-basic");
  return (
    <Row>
      <Button>{text.secondary}</Button>
      <Button variant="primary">{text.primary}</Button>
      <Button variant="danger">{text.danger}</Button>
      <Button disabled>{text.disabled}</Button>
    </Row>
  );
}
