import { useState } from "react";
import { Button, Markdown, Row, Stack, Viewer } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("viewer-document");
  const [open, setOpen] = useState(false);
  const props = {
    icon: "file" as const,
    title: text.title,
    meta: text.meta,
    actions: <Button icon="copy" label={text.copy} />,
    onClose: () => setOpen(false),
    children: (
      <div style={{ padding: "var(--space-6)" }}>
        <Markdown readOnly defaultValue={text.body} />
      </div>
    ),
  };
  return (
    <Stack>
      <div style={{ height: 420 }}>
        <Viewer inline {...props} />
      </div>
      <Row>
        <Button onClick={() => setOpen(true)}>{text.open}</Button>
      </Row>
      <Viewer open={open} {...props} />
    </Stack>
  );
}
