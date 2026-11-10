import { Tabs } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("tabs-scroll");
  const names = text.items;
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <Tabs label={text.campaignType} items={names.map((name, i) => ({ id: String(i), label: name }))} />
    </div>
  );
}
