import { useState } from "react";
import { Checkbox } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("checkbox-basic");
  const [alsoChannel, setAlsoChannel] = useState(false);
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Checkbox label={text.alsoChannel} checked={alsoChannel} onChange={setAlsoChannel} />
      <Checkbox label={text.notify} defaultChecked />
      <Checkbox label={text.archived} disabled />
    </div>
  );
}
