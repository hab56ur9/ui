import { useState } from "react";
import { Tabs } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  const [range, setRange] = useState("7d");
  return (
    <div style={{ display: "grid", gap: "var(--space-6)" }}>
      <Tabs
        variant="pill"
        label={t({ ko: "기간", en: "Range" })}
        value={range}
        onChange={setRange}
        items={[
          { id: "1d", label: t({ ko: "오늘", en: "Today" }) },
          { id: "7d", label: t({ ko: "7일", en: "7 days" }) },
          { id: "30d", label: t({ ko: "30일", en: "30 days" }) },
          { id: "90d", label: t({ ko: "90일", en: "90 days" }) },
        ]}
      />
      <Tabs
        variant="pill"
        fill
        label={t({ ko: "보기", en: "View" })}
        items={[
          { id: "chart", label: t({ ko: "차트", en: "Chart" }), icon: "chart-line" },
          { id: "table", label: t({ ko: "표", en: "Table" }), icon: "table" },
          { id: "alerts", label: t({ ko: "알림", en: "Alerts" }), icon: "bell", badge: 12 },
        ]}
      />
    </div>
  );
}
