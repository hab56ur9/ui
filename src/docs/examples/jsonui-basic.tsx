import { JsonUI, useToast, type JsonUINode } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("jsonui-basic");
  const toast = useToast();
  const node: JsonUINode = {
    type: "Widget",
    props: { id: "visits", title: text.visitors, w: 6, h: 3 },
    children: [
      { type: "Stat", props: { value: "12,480", delta: { change: 0.12, label: text.vsLastWeek } } },
      { type: "Button", props: { variant: "primary", onClick: { $action: { name: "open-report" } } }, children: text.openReport },
    ],
  };
  return <JsonUI node={node} onAction={({ name }) => toast({ message: name, status: "info" })} />;
}
