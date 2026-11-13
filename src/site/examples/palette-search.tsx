import { useState } from "react";
import { Button, CommandPalette, Row, Stack } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("palette-search");
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState("");
  const props = {
    placeholder: text.placeholder,
    onSelect: setPicked,
    groups: [
      {
        title: text.tickets,
        items: [
          { id: "T-12", label: text.ticket1, detail: "T-12 · design-system", icon: "check" },
          { id: "T-15", label: text.ticket2, detail: "T-15 · beetree", icon: "check" },
        ],
      },
      {
        title: text.docs,
        items: [{ id: "D-3", label: text.doc1, detail: "D-3", icon: "bookmark" }],
      },
      {
        title: text.channels,
        items: [
          { id: "design-system", label: "#design-system", icon: "message" },
          { id: "beetree", label: "#beetree", icon: "message" },
        ],
      },
    ],
  };
  return (
    <Stack>
      <CommandPalette inline {...props} />
      <Row>
        <Button onClick={() => setOpen(true)}>{text.open}</Button>
        {picked && <span>{text.picked.replace("{id}", picked)}</span>}
      </Row>
      <CommandPalette open={open} onClose={() => setOpen(false)} {...props} />
    </Stack>
  );
}
