import { Segmented, useToast } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("segmented-basic");
  const toast = useToast();
  const options = [
    { value: "7", label: text.n7d },
    { value: "30", label: text.n30d },
    { value: "90", label: text.n90d },
    { value: "365", label: text.n1y },
  ];
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", justifyItems: "center" }}>
      <Segmented label={text.range} defaultValue="90" options={options} onChange={(value) => toast({ message: value })} />
      <Segmented label={text.locked} defaultValue="30" options={options} disabled />
    </div>
  );
}
