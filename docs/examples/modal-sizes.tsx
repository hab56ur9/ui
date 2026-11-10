import { useState } from "react";
import { Button, Modal } from "ui";
import { fill, Row, useText } from "../demo";
import { Mockup } from "../Mockup";

const SIZES = ["sm", "md", "lg"] as const;

export default function Example() {
  const text = useText("modal-sizes");
  const [size, setSize] = useState<(typeof SIZES)[number] | null>(null);
  const props = {
    title: text.exportReport,
    description: text.downloadTheSelected,
    actions: [
      { label: text.cancel, value: "cancel" },
      { label: text.export, value: "export", variant: "primary" as const, autoFocus: true },
    ],
    children: text.theFileHolds,
  };
  return (
    <>
      <Mockup place="center">
        <Modal inline open size="sm" onClose={() => undefined} {...props} />
      </Mockup>
      <Row>
        {SIZES.map((option) => (
          <Button key={option} onClick={() => setSize(option)}>
            {fill(text.open, { size: option })}
          </Button>
        ))}
      </Row>
      <Modal open={size !== null} size={size ?? "md"} onClose={() => setSize(null)} {...props} />
    </>
  );
}
