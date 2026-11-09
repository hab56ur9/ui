import { useState } from "react";
import { TabBar } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  const [tab, setTab] = useState("today");
  return (
    <div style={{ maxWidth: 390, margin: "0 auto", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
      <div style={{ height: 120, display: "grid", placeItems: "center", color: "var(--color-fg-muted)" }}>{tab}</div>
      <TabBar
        value={tab}
        onChange={setTab}
        items={[
          { id: "today", label: t({ ko: "오늘", en: "Today" }), icon: "home" },
          { id: "workouts", label: t({ ko: "운동", en: "Workouts" }), icon: "calendar", badge: 2 },
          { id: "trends", label: t({ ko: "추세", en: "Trends" }), icon: "chart-line" },
          { id: "profile", label: t({ ko: "내 정보", en: "Profile" }), icon: "user" },
        ]}
      />
    </div>
  );
}
