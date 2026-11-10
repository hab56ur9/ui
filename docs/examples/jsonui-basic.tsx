import { JsonUI, useToast, type JsonUINode } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  const toast = useToast();
  const node: JsonUINode = {
    type: "Widget",
    props: { id: "visits", title: t({ ko: "방문자", en: "Visitors" }), w: 6, h: 3 },
    children: [
      { type: "Stat", props: { value: "12,480", delta: { change: 0.12, label: t({ ko: "지난주 대비", en: "vs last week" }) } } },
      { type: "Button", props: { variant: "primary", onClick: { $action: { name: "open-report" } } }, children: t({ ko: "리포트 열기", en: "Open report" }) },
    ],
  };
  return <JsonUI node={node} onAction={({ name }) => toast({ message: name, status: "info" })} />;
}
