import { JsonUI, useI18n, useToast, type JsonUINode } from "ui";
import { useT } from "../demo";

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
  const t = useT();
  const toast = useToast();
  const { locale } = useI18n();
  const number = new Intl.NumberFormat(locale);
  const template: JsonUINode[] = [
    {
      type: "WidgetGrid",
      children: [
        {
          type: "Widget",
          props: { id: "orders", title: t({ ko: "오늘 주문", en: "Orders today" }), w: 4, h: 3 },
          children: { type: "Stat", props: { value: { $data: "orders.today", $format: "count" }, delta: { change: { $data: "orders.change" } } } },
        },
        {
          type: "Widget",
          props: { id: "recent", title: t({ ko: "최근 주문", en: "Recent orders" }), w: 8, h: 3 },
          children: {
            type: "DataTable",
            props: {
              columns: [
                { label: t({ ko: "주문", en: "Order" }) },
                { label: t({ ko: "상품", en: "Item" }) },
                { label: t({ ko: "금액", en: "Amount" }), numeric: true },
                { label: t({ ko: "상태", en: "Status" }) },
              ],
              rows: {
                $each: { $data: "orders.recent" },
                $as: [
                  { $field: "id" },
                  { $field: "item" },
                  { $field: "amount", $format: "won" },
                  { $field: "status", $labels: t({ ko: { paid: "결제 완료", shipped: "배송 중", refunded: "환불" }, en: { paid: "Paid", shipped: "Shipped", refunded: "Refunded" } }) },
                ],
              },
            },
          },
        },
      ],
    },
    { type: "Button", props: { icon: "download", onClick: { $action: { name: "export-orders" } } }, children: t({ ko: "내려받기", en: "Export" }) },
  ];
  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>
      <JsonUI node={template} data={data} formats={{ count: (v) => number.format(v), won: (v) => `₩${number.format(v)}` }} onAction={({ name }) => toast({ message: name, status: "info" })} />
    </div>
  );
}
