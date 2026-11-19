import { Menu, Row, useToast } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("menu-basic");
  const toast = useToast();
  const items = [
    { id: "link", label: text.link, icon: "link" },
    { id: "mute", label: text.mute, icon: "bell" },
    { id: "archive", label: text.archive, icon: "download", disabled: true },
    { id: "trash", label: text.trash, icon: "trash", danger: true },
    { id: "delete", label: text.delete, icon: "warning", danger: true },
  ];
  return (
    <Row>
      <Menu items={items} onSelect={(id) => toast({ message: items.find((item) => item.id === id)?.label ?? id })} />
    </Row>
  );
}
