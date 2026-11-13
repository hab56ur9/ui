import { useState } from "react";
import { Badge, CodeEditor, Row, Stack } from "ui";
import { useText } from "../demo";

const SOURCE = `export function total(items: number[]) {
  let sum = 0;
  for (const item of items) sum += item;
  return sum;
}`;

export default function Example() {
  const text = useText("code-editor-basic");
  const [code, setCode] = useState(SOURCE);
  return (
    <Stack>
      <div style={{ height: 200, border: "var(--border-width-default) solid var(--color-border-default)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
        <CodeEditor value={code} onChange={setCode} focus={[3]} />
      </div>
      <Row>
        <Badge>{text.lines.replace("{n}", String(code.split("\n").length))}</Badge>
        <Badge tone={code === SOURCE ? "neutral" : "main"}>{code === SOURCE ? text.clean : text.edited}</Badge>
      </Row>
    </Stack>
  );
}
