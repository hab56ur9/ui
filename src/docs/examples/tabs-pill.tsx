import { useState } from "react";
import { Tabs } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("tabs-pill");
  const [range, setRange] = useState("7d");
  return (
    <div style={{ display: "grid", gap: "var(--space-6)" }}>
      <Tabs
        variant="pill"
        label={text.range}
        value={range}
        onChange={setRange}
        items={[
          { id: "1d", label: text.today },
          { id: "7d", label: text.n7Days },
          { id: "30d", label: text.n30Days },
          { id: "90d", label: text.n90Days },
        ]}
      />
      <Tabs
        variant="pill"
        fill
        label={text.view}
        items={[
          { id: "chart", label: text.chart, icon: "chart-line" },
          { id: "table", label: text.table, icon: "table" },
          { id: "alerts", label: text.alerts, icon: "bell", badge: 12 },
        ]}
      />
    </div>
  );
}
