import { JsonUI, useI18n, useToast, type JsonUINode } from "ui";
import { useText } from "../demo";

const data = {
  "orders.today": 1284,
  "orders.change": 0.083,
  "orders.recent": [
    { id: "A-1042", item: "Notebook", amount: 18000, status: "paid" },
    { id: "A-1041", item: "Pen set", amount: 9500, status: "shipped" },
    { id: "A-1040", item: "Desk lamp", amount: 42000, status: "refunded" },
  ],
};

export default function Example() {
  const text = useText("jsonui-template");
  const toast = useToast();
  const { locale } = useI18n();
  const number = new Intl.NumberFormat(locale);
  const template: JsonUINode[] = [
    {
      type: "WidgetGrid",
      children: [
        {
          type: "Widget",
          props: { id: "orders", title: text.ordersToday, w: 4, h: 3 },
          children: { type: "Stat", props: { value: { $data: "orders.today", $format: "count" }, delta: { change: { $data: "orders.change" } } } },
        },
        {
          type: "Widget",
          props: { id: "recent", title: text.recentOrders, w: 8, h: 3 },
          children: {
            type: "DataTable",
            props: {
              columns: [{ label: text.order }, { label: text.item }, { label: text.amount, numeric: true }, { label: text.status }],
              rows: {
                $each: { $data: "orders.recent" },
                $as: [{ $field: "id" }, { $field: "item" }, { $field: "amount", $format: "won" }, { $field: "status", $labels: text.item2 }],
              },
            },
          },
        },
      ],
    },
    { type: "Button", props: { icon: "download", onClick: { $action: { name: "export-orders" } } }, children: text.export },
  ];
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <JsonUI node={template} data={data} formats={{ count: (v) => number.format(v), won: (v) => `₩${number.format(v)}` }} onAction={({ name }) => toast({ message: name, status: "info" })} />
    </div>
  );
}
