import { useState } from "react";
import { Chip, Row } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("chip-basic");
  const [waits, setWaits] = useState([text.waits]);
  return (
    <Row>
      <Chip label={text.design} icon="bookmark" />
      <Chip label={text.sub} onSelect={() => undefined} />
      {waits.map((label) => (
        <Chip key={label} label={label} onSelect={() => undefined} onRemove={() => setWaits([])} />
      ))}
    </Row>
  );
}
